using System.Text;
using Newtonsoft.Json;
using Session001.API;
using Session001.Tests.Fixtures;

namespace Session001.Tests.Base;

public abstract class BaseIntegrationTest : IClassFixture<CustomWebApplicationFactory<Program>>
{
    protected readonly CustomWebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;

    protected BaseIntegrationTest(CustomWebApplicationFactory<Program> factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    protected static StringContent CreateJsonContent<T>(T obj)
    {
        var json = JsonConvert.SerializeObject(obj);
        return new StringContent(json, Encoding.UTF8, "application/json");
    }

    protected static async Task<T?> DeserializeResponse<T>(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<T>(content);
    }

    protected static async Task<string> GetResponseContent(HttpResponseMessage response)
    {
        return await response.Content.ReadAsStringAsync();
    }
}
