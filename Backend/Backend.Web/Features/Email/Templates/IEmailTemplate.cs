namespace Backend.Web.Features.Email.Templates;

public interface IEmailTemplate
{
    string Subject { get; }
    string RenderHtml();
}