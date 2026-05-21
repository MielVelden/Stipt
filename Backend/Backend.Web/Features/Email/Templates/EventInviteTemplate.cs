using Backend.Database.Entities.Events;

namespace Backend.Web.Features.Email.Templates;

public class EventInviteTemplate(Event @event, string plainTextToken) : EmailTemplateBase
{
    public override string Subject => $"Uitnodiging voor {@event.Name}";

    protected override string RenderContent()
    {
        var appLink = $"Mobile://event-invite/{@event.Id}?token={plainTextToken}"; // TODO: change app name / full url to work with accepting invite in app
        
        return $"""
        <h2 style="margin-top: 0; color: #222222; font-size: 24px;">Je bent uitgenodigd!</h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Je bent uitgenodigd voor het evenement <strong>{@event.Name}</strong>.
        </p>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Download de EventConnect app en kopieer de onderstaande token of gebruik de knop hieronder om direct deel te nemen in de app.
        </p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Jouw uitnodigingscode</p>
            <p style="margin: 5px 0 0 0; color: #212529; font-size: 24px; font-weight: bold; font-family: monospace;">{plainTextToken}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
            <a href="{appLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                Accepteer in de app
            </a>
        </div>

        <p style="color: #888888; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
            <em>Let op, deze uitnodiging is 14 dagen geldig.</em>
        </p>
        """;
    }
}