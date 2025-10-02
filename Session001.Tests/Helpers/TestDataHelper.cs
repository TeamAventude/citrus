using Session001.Data.DTOs;

namespace Session001.Tests.Helpers;

public static class TestDataHelper
{
    public static List<int> CreateProductIdList(int count, int startId = 1)
    {
        return Enumerable.Range(startId, count).ToList();
    }
}
