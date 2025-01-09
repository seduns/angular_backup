using Mymicroservice_7.IdentityService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<IdentityServiceTestsModule>();

public partial class TestProgram
{
}
