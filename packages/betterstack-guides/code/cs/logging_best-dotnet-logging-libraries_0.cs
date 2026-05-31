# Source: https://betterstack.com/community/guides/logging/best-dotnet-logging-libraries/
# Original language: csharp
# Normalized: cs
# Block index: 0

using System;
using Microsoft.Extensions.Logging;

public class Program
{
    static void Main(string[] args)
    {
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information)); // Set to Information level
        ILogger logger = factory.CreateLogger("Program");

        logger.LogTrace("Trace message");
        logger.LogDebug("Debug message");
        logger.LogInformation("Info message");
        logger.LogWarning("Warning message");
        logger.LogError("Error message");
        logger.LogCritical("Critical message");
    }
}