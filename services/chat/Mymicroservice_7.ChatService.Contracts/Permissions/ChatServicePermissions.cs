using Volo.Abp.Reflection;

namespace Mymicroservice_7.ChatService.Permissions;

public class ChatServicePermissions
{
    public const string GroupName = "ChatService";

    public static string[] GetAll()
    {
        return ReflectionHelper.GetPublicConstantsRecursively(typeof(ChatServicePermissions));
    }
}