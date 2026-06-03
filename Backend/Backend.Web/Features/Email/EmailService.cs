using Backend.Database.Entities;
using Backend.Database.Entities.Events;
using Backend.Database.Entities.Notifications;
using Backend.Web.Features.Email.Templates;
using Resend;

namespace Backend.Web.Features.Email;

public class EmailService(IUserRepository userRepository, IResend emailClient, IConfiguration configuration)
{
    const string SENDER = "EventConnect <eventconnect@stipt.slempers.nl>";

    public async Task SendUserNotificationAsync(UserNotification userNotification, CancellationToken ct)
    {
        var participantEmail = await userRepository.GetEmailByIdAsync(userNotification.UserId, ct) ?? throw new ArgumentException($"User {userNotification.UserId} not found");
        var template = new UserNotificationTemplate(userNotification);
        
        var message = new EmailMessage
        {
            From = SENDER,
            To = participantEmail,
            Subject = template.Subject,
            HtmlBody = template.RenderHtml()
        };

        try
        {
            await emailClient.EmailSendAsync(message, ct);
        }
        catch (Exception)
        {
            throw new Exception($"Failed to send email");
        }
    }

    public async Task SendEventInviteAsync(string email, Event @event, string plainTextToken, CancellationToken ct)
    {        
        var backofficeUrl = configuration.GetValue<string>("BackofficeUrl") ?? "http://localhost:5173";
        var template = new EventInviteTemplate(@event, plainTextToken, backofficeUrl);
        
        var message = new EmailMessage
        {
            From = SENDER,
            To = email,
            Subject = template.Subject,
            HtmlBody = template.RenderHtml()
        };

        try
        {
            await emailClient.EmailSendAsync(message, ct);
        }
        catch (Exception)
        {
            throw new Exception($"Failed to send email");
        }
    }
}