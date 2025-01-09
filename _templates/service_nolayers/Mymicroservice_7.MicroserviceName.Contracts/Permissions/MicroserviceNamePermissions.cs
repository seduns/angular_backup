using Volo.Abp.Reflection;

namespace Mymicroservice_7.MicroserviceName.Permissions;

public class MicroserviceNamePermissions
{
    public const string GroupName = "MicroserviceName";

    public static string[] GetAll()
    {
        return ReflectionHelper.GetPublicConstantsRecursively(typeof(MicroserviceNamePermissions));
    }
}