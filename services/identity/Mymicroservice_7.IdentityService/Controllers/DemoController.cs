using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Mymicroservice_7.IdentityService.Controllers;

[Route("api/identity/demo")]
public class DemoController : AbpController
{
    [HttpGet]
    [Route("hello")]
    public async Task<string> HelloWorld()
    {
        return await Task.FromResult("Hello World!");
    }
}