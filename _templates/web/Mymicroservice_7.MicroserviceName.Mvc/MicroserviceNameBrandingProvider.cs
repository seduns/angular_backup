using Microsoft.Extensions.Localization;
using Mymicroservice_7.Web.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Mymicroservice_7.MicroserviceName;

[Dependency(ReplaceServices = true)]
public class MicroserviceNameBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<MicroserviceNameResource> _localizer;

    public MicroserviceNameBrandingProvider(IStringLocalizer<MicroserviceNameResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["MicroserviceName"];
}
