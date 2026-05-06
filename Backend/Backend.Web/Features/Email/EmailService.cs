using Backend.Database.Entities;
using Backend.Database.Entities.Notifications;
using Backend.Web.Features.Email.Templates;
using Resend;

namespace Backend.Web.Features.Email;

public class EmailService(IUserRepository userRepository, IResend emailClient)
{
    public async Task SendUserNotificationAsync(UserNotification userNotification, CancellationToken ct)
    {
        var participantEmail = userRepository.GetEmailByIdAsync(userNotification.UserId, ct).Result;
        if (participantEmail == null)
        {
            throw new ArgumentException($"User {userNotification.UserId} not found");
        }

        var template = new UserNotificationTemplate(userNotification);
        
        var message = new EmailMessage
        {
            From = "EventConnect <onboarding@resend.dev>",
            To = participantEmail,
            Subject = template.Subject,
            HtmlBody = template.RenderHtml()
        };
        await emailClient.EmailSendAsync(message, ct);
    }
}