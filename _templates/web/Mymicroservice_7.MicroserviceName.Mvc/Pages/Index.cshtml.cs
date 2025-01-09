using Microsoft.AspNetCore.Authentication;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Mymicroservice_7.MicroserviceName.Pages;

public class IndexModel : AbpPageModel
{
    public void OnGet()
    {

    }

    public async Task OnPostLoginAsync()
    {
        await HttpContext.ChallengeAsync("oidc");
    }
}
