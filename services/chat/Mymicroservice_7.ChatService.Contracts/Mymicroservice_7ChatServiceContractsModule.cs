using Localization.Resources.AbpUi;
using Mymicroservice_7.ChatService.Localization;
using Volo.Abp.Commercial.SuiteTemplates;
using Volo.Abp.Application;
using Volo.Abp.Authorization;
using Volo.Abp.Domain;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.UI;
using Volo.Abp.Validation;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;
using Volo.Chat;

namespace Mymicroservice_7.ChatService;

[DependsOn(
    typeof(ChatApplicationContractsModule),
    typeof(AbpValidationModule),
    typeof(AbpUiModule),
    typeof(VoloAbpCommercialSuiteTemplatesModule),
    typeof(AbpAuthorizationAbstractionsModule),
    typeof(AbpDddApplicationContractsModule),
    typeof(AbpDddDomainSharedModule)
    )]
public class Mymicroservice_7ChatServiceContractsModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<Mymicroservice_7ChatServiceContractsModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<ChatServiceResource>("en")
                .AddBaseTypes(typeof(AbpValidationResource), typeof(AbpUiResource))
                .AddVirtualJson("/Localization/ChatService");
        });

        Configure<AbpExceptionLocalizationOptions>(options =>
        {
            options.MapCodeNamespace("ChatService", typeof(ChatServiceResource));
        });
    }
}
