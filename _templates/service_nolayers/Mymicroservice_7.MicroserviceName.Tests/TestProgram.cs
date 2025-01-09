using Mymicroservice_7.MicroserviceName.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<MicroserviceNameTestsModule>();

public partial class TestProgram
{
}
