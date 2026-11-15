using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Tests;

internal static class TestDatabase
{
    private static readonly SemaphoreSlim MigrationLock = new(1, 1);

    public static async Task MigrateAsync(CampusFlowDbContext db)
    {
        await MigrationLock.WaitAsync();
        try
        {
            await db.Database.MigrateAsync();
        }
        finally
        {
            MigrationLock.Release();
        }
    }
}
