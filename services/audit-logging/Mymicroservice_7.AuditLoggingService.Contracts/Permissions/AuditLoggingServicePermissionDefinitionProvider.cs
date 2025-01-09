using Mymicroservice_7.AuditLoggingService.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Mymicroservice_7.AuditLoggingService.Permissions;

public class AuditLoggingServicePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        //var myGroup = context.AddGroup(AuditLoggingServicePermissions.GroupName);
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<AuditLoggingServiceResource>(name);
    }
}