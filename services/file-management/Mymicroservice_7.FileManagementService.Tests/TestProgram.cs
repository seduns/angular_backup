using Mymicroservice_7.FileManagementService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<FileManagementServiceTestsModule>();

public partial class TestProgram
{
}
