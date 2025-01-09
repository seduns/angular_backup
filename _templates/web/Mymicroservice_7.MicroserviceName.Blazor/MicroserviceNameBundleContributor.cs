using Volo.Abp.Bundling;

namespace Mymicroservice_7.MicroserviceName;

public class MicroserviceNameBundleContributor : IBundleContributor
{
    public void AddScripts(BundleContext context)
    {
    }

    public void AddStyles(BundleContext context)
    {
        context.Add("main.css");
    }
}
