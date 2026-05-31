# Source: https://betterstack.com/community/guides/logging/best-dotnet-logging-libraries/
# Original language: csharp
# Normalized: cs
# Block index: 2

using System;
using Microsoft.Extensions.Logging;

public class Program
{
    static void Main(string[] args)
    {
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information));
        ILogger logger = factory.CreateLogger("Program");

        string productName = "Example Product";
        int quantity = 3;
        decimal totalPrice = 150.99M;

        logger.LogInformation($"Ordering {quantity} units of {productName} with a total price of {totalPrice:C}");
    }
}