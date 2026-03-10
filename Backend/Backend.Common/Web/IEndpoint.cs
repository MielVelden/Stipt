using Microsoft.AspNetCore.Routing;

namespace Backend.Common.Web;

public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
