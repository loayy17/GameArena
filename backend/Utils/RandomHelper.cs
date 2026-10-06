namespace backend.Utils;

public static class RandomHelper
{
    public static int Index(int count) => count <= 0 ? -1 : Random.Shared.Next(count);

    public static int Pick(IReadOnlyList<int> items) => Index(items.Count) is var index && index >= 0
        ? items[index]
        : -1;

    public static bool CoinFlip(double probability = 0.5) =>
        Random.Shared.NextDouble() < probability;
}
