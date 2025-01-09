using Mymicroservice_7.GdprService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<GdprServiceTestsModule>();

public partial class TestProgram
{
}
