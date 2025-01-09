using Mymicroservice_7.AuditLoggingService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<AuditLoggingServiceTestsModule>();

public partial class TestProgram
{
}
