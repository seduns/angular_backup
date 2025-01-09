using Mymicroservice_7.AdministrationService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<AdministrationServiceTestsModule>();

public partial class TestProgram
{
}
