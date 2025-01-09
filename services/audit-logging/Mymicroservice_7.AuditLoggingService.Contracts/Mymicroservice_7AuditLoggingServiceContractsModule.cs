using Localization.Resources.AbpUi;
using Mymicroservice_7.AuditLoggingService.Localization;
using Volo.Abp.Commercial.SuiteTemplates;
using Volo.Abp.Application;
using Volo.Abp.Authorization;
using Volo.Abp.Domain;
using Volo.Abp.Localization;
using Volo.Abp.AuditLogging;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.UI;
using Volo.Abp.Validation;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace Mymicroservice_7.AuditLoggingService;

[DependsOn(
    typeof(AbpValidationModule),
    typeof(AbpUiModule),
    typeof(AbpAuthorizationAbstractionsModule),
    typeof(VoloAbpCommercialSuiteTemplatesModule),
    typeof(AbpAuditLoggingApplicationContractsModule),
    typeof(AbpDddApplicationContractsModule),
    typeof(AbpDddDomainSharedModule)
    )]
public class Mymicroservice_7AuditLoggingServiceContractsModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<Mymicroservice_7AuditLoggingServiceContractsModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<AuditLoggingServiceResource>("en")
                .AddBaseTypes(typeof(AbpValidationResource), typeof(AbpUiResource))
                .AddVirtualJson("/Localization/AuditLoggingService");
        });

        Configure<AbpExceptionLocalizationOptions>(options =>
        {
            options.MapCodeNamespace("AuditLoggingService", typeof(AuditLoggingServiceResource));
        });
    }
}
