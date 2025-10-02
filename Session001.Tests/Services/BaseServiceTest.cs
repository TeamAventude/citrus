using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Session001.Data;

namespace Session001.Tests.Services;

/// <summary>
/// Base class for service unit tests providing common setup and utilities
/// </summary>
public abstract class BaseServiceTest : IDisposable
{
    protected ApplicationDbContext Context { get; private set; }

    protected BaseServiceTest()
    {
        Context = CreateInMemoryDbContext();
    }

    protected static ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .EnableSensitiveDataLogging()
            .Options;

        return new ApplicationDbContext(options);
    }

    protected static Mock<ILogger<T>> CreateLoggerMock<T>()
    {
        return new Mock<ILogger<T>>();
    }

    protected static void VerifyLogCalled<T>(Mock<ILogger<T>> loggerMock, LogLevel logLevel, string expectedMessage, Moq.Times times)
    {
        loggerMock.Verify(
            x => x.Log(
                logLevel,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(expectedMessage)),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            times);
    }

    protected static void VerifyLogCalledWithException<T>(Mock<ILogger<T>> loggerMock, LogLevel logLevel, string expectedMessage)
    {
        loggerMock.Verify(
            x => x.Log(
                logLevel,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(expectedMessage)),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    public virtual void Dispose()
    {
        Context?.Dispose();
        GC.SuppressFinalize(this);
    }
}