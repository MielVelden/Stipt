namespace Backend.Common.Application;

public sealed class ConflictException(string message) : Exception(message);
