using Volo.Abp.Reflection;

namespace Mymicroservice_7.FileManagementService.Permissions;

public class FileManagementServicePermissions
{
    public const string GroupName = "FileManagementService";

    public static string[] GetAll()
    {
        return ReflectionHelper.GetPublicConstantsRecursively(typeof(FileManagementServicePermissions));
    }
}