using backend.Data;

namespace backend.Utils;

public static class TransactionHelper
{
    public static async Task ExecuteAsync(AppDbContext context, Func<Task> action)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await action();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
