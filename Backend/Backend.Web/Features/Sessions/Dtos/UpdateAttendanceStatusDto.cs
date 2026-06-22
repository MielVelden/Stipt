using Backend.Database.Entities.SessionsAttendances;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record UpdateAttendanceStatusDto(SessionAttendanceStatus Status);
