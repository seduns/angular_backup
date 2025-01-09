using Mymicroservice_7.SaasService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<SaasServiceTestsModule>();

public partial class TestProgram
{
}
