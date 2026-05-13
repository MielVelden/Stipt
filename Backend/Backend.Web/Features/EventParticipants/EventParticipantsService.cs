using System.Security.Cryptography;
using System.Text;
using Backend.Database.Entities;
using Backend.Database.Entities.EventParticipants;
using Backend.Database.Entities.Events;
using Backend.Web.Features.Email;
using Backend.Web.Features.EventParticipants.Dtos;
using Backend.Web.Features.EventParticipants.Exceptions;
using Microsoft.AspNetCore.Identity;

namespace Backend.Web.Features.EventParticipants;

public sealed class EventParticipantsService(
    IEventParticipantRepository eventParticipantRepository,
    IInviteTokenRepository inviteTokenRepository,
    IEventRepository eventRepository,
    EmailService emailService,
    UserManager<ApplicationUser> userManager)
{
    private static string GenerateInviteToken()
    {
        const string validChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
        return RandomNumberGenerator.GetString(validChars, 15);
    }

    private static string HashToken(string token)
    {
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }

    public async Task<EventParticipantRo> CreateAsync(Guid eventId, CreateEventParticipantDto request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var participants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        if (participants.Any(p => string.Equals(p.User.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase)))
            throw new DuplicateParticipantException();

        var existsInInvites = await inviteTokenRepository.ExistsAsync(eventId, normalizedEmail, cancellationToken);
        if (existsInInvites)
            throw new DuplicateParticipantException();

        var @event = await eventRepository.GetByIdAsync(eventId, cancellationToken) ?? throw new ArgumentException("Event not found");

        var plainTextToken = GenerateInviteToken();
        var inviteToken = new InviteToken
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            Email = normalizedEmail,
            TokenHash = HashToken(plainTextToken),
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(14)
        };

        await inviteTokenRepository.AddAsync(inviteToken, cancellationToken);
        await emailService.SendEventInviteAsync(normalizedEmail, @event, plainTextToken, cancellationToken);

        return inviteToken.ToRo();
    }

    public async Task<BulkCreateEventParticipantsRo> BulkCreateAsync(Guid eventId, BulkCreateEventParticipantsDto request, CancellationToken cancellationToken)
    {
        var totalRows = request.Emails.Length;
        
        var uniqueFileEmails = request.Emails
            .Where(e => !string.IsNullOrWhiteSpace(e))
            .Select(e => e.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        var duplicatesInFile = totalRows - uniqueFileEmails.Count;

        var existingParticipants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        var existingParticipantEmails = existingParticipants.Select(p => p.User.Email?.ToLowerInvariant() ?? string.Empty).ToHashSet();

        var existingInvites = await inviteTokenRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        var existingInviteEmails = existingInvites.Select(i => i.Email.ToLowerInvariant()).ToHashSet();

        var newEmails = uniqueFileEmails
            .Where(e => !existingParticipantEmails.Contains(e) && !existingInviteEmails.Contains(e))
            .ToList();
            
        var duplicatesInDatabase = uniqueFileEmails.Count - newEmails.Count;

        var @event = await eventRepository.GetByIdAsync(eventId, cancellationToken) ?? throw new ArgumentException("Event not found");

        var newInvites = new List<InviteToken>();
        foreach (var email in newEmails)
        {
            var plainTextToken = GenerateInviteToken();
            var inviteToken = new InviteToken
            {
                Id = Guid.NewGuid(),
                EventId = eventId,
                Email = email,
                TokenHash = HashToken(plainTextToken),
                CreatedAtUtc = DateTime.UtcNow,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(14)
            };
            
            newInvites.Add(inviteToken);
            await emailService.SendEventInviteAsync(email, @event, plainTextToken, cancellationToken);
        }

        if (newInvites.Any())
        {
            await inviteTokenRepository.AddRangeAsync(newInvites, cancellationToken);
        }

        return new BulkCreateEventParticipantsRo(
            totalRows,
            duplicatesInFile,
            duplicatesInDatabase,
            newInvites.Count
        );
    }

    public async Task<EventParticipantRo?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        
        var invite = await inviteTokenRepository.GetByEventIdAndEmailAsync(eventId, normalizedEmail, cancellationToken);
        if (invite != null)
            return invite.ToRo();

        var existingParticipants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        var participant = existingParticipants.FirstOrDefault(p => string.Equals(p.User.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));

        return participant?.ToRo();
    }

    public async Task<List<EventParticipantRo>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var participants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        var invites = await inviteTokenRepository.GetAllByEventIdAsync(eventId, cancellationToken);

        return participants.Select(EventParticipantMappings.ToRo)
            .Concat(invites.Select(EventParticipantMappings.ToRo))
            .OrderBy(ro => ro.CreatedAtUtc)
            .ToList();
    }

    public async Task<List<EventParticipantRo>> GetEventsByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await userManager.FindByEmailAsync(normalizedEmail);
        
        if (user == null)
            return new List<EventParticipantRo>();

        var participants = await eventParticipantRepository.GetAllByUserIdAsync(user.Id, cancellationToken);
        return participants.Select(EventParticipantMappings.ToRo).ToList();
    }

    public async Task<bool> DeleteAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        
        var invite = await inviteTokenRepository.GetByEventIdAndEmailAsync(eventId, normalizedEmail, cancellationToken);
        if (invite != null)
        {
            return await inviteTokenRepository.DeleteAsync(invite.Id, cancellationToken);
        }

        var existingParticipants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);
        var participant = existingParticipants.FirstOrDefault(p => string.Equals(p.User.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase));
        
        if (participant != null)
        {
            return await eventParticipantRepository.DeleteAsync(eventId, participant.UserId, cancellationToken);
        }

        return false;
    }
}
