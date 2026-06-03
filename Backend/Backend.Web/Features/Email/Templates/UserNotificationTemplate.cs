using Backend.Database.Entities.Notifications;

namespace Backend.Web.Features.Email.Templates;

public class UserNotificationTemplate(UserNotification notification) : EmailTemplateBase
{
    public override string Subject => notification.Title;

    protected override string RenderContent()
    {
        return $"""
        <h1 style="margin-top: 0; color: #222222; font-size: 28px;">
            {notification.Title}
        </h1>
        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
            {notification.Message}
        </p>
        """;
    }
}