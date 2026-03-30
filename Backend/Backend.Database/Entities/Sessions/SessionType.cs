using TypeGen.Core.TypeAnnotations;

namespace Backend.Database.Entities.Sessions;

[ExportTsEnum]
[TsStringInitializers]
public enum SessionType
{
    Keynote,
    Breakout
}