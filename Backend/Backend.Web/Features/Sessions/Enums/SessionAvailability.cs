using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Enums;

[ExportTsEnum]
[TsStringInitializers]
public enum SessionAvailability
{
    Available,  // Groen (< 80% vol)
    FillingUp,  // Oranje (>= 80% vol)
    Full        // Rood (100% vol)
}