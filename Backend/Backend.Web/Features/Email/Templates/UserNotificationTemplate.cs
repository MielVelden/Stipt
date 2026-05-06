using Backend.Database.Entities.Notifications;

namespace Backend.Web.Features.Email.Templates;

public record UserNotificationTemplate(UserNotification Notification) : IEmailTemplate
{
    public string Subject => Notification.Title;

    public string RenderHtml()
    {
        return $"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>{Notification.Title}</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        ">
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="padding: 40px 0;"
            >
                <tr>
                    <td align="center">
                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                background-color: #ffffff;
                                border-radius: 8px;
                                padding: 40px;
                            "
                        >
                            <tr>
                                <td>
                                    <h1 style="
                                        margin-top: 0;
                                        color: #222222;
                                        font-size: 28px;
                                    ">
                                        {Notification.Title}
                                    </h1>

                                    <p style="
                                        color: #555555;
                                        font-size: 16px;
                                        line-height: 1.6;
                                        margin-bottom: 0;
                                    ">
                                        {Notification.Message}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """;
    }
}