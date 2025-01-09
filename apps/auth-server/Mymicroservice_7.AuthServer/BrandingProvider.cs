using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Mymicroservice_7.AuthServer;

[Dependency(ReplaceServices = true)]
public class BrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "Mymicroservice_7 Authentication Server";
}