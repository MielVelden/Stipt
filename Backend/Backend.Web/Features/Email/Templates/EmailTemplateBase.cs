namespace Backend.Web.Features.Email.Templates;

public abstract class EmailTemplateBase
{
    public abstract string Subject { get; }

    protected abstract string RenderContent();

    public string RenderHtml()
    {
        return $$"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{{Subject}}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <tr>
                                <td>
                                    {{RenderContent()}}
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