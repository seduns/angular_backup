using Mymicroservice_7.MicroserviceName.Localization;
using Volo.Abp.AspNetCore.Components;

namespace Mymicroservice_7.MicroserviceName;

public abstract class MicroserviceNameComponentBase : AbpComponentBase
{
    protected MicroserviceNameComponentBase()
    {
        LocalizationResource = typeof(MicroserviceNameResource);
    }
}
