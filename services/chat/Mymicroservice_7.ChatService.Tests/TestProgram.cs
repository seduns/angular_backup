using Mymicroservice_7.ChatService.Tests;
using Microsoft.AspNetCore.Builder;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
await builder.RunAbpModuleAsync<ChatServiceTestsModule>();

public partial class TestProgram
{
}
