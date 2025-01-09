using Volo.Abp.Reflection;

namespace Mymicroservice_7.GdprService.Permissions;

public class GdprServicePermissions
{
    public const string GroupName = "GdprService";

    public static string[] GetAll()
    {
        return ReflectionHelper.GetPublicConstantsRecursively(typeof(GdprServicePermissions));
    }
}