{{~
    if config.database_provider != "ef"
    helpers.delete_this_file
    else
    helpers.rename_this_file("MicroserviceNameDatabaseMigrationEventHandler.cs")
    end
~}}
using Volo.Abp.DistributedLocking;
using Volo.Abp.EntityFrameworkCore.Migrations;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.DistributedLocking;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace Mymicroservice_7.MicroserviceName.Data;

public class MicroserviceNameDatabaseMigrationEventHandler : EfCoreDatabaseMigrationEventHandlerBase<MicroserviceNameDbContext>
{
    private readonly MicroserviceNameDataSeeder _dataSeeder;

    public MicroserviceNameDatabaseMigrationEventHandler(
        ILoggerFactory loggerFactory,
        ICurrentTenant currentTenant,
        IUnitOfWorkManager unitOfWorkManager,
        ITenantStore tenantStore,
        IAbpDistributedLock abpDistributedLock,
        IDistributedEventBus distributedEventBus,
        MicroserviceNameDataSeeder dataSeeder
    ) : base(
        MicroserviceNameDbContext.DatabaseName,
        currentTenant,
        unitOfWorkManager,
        tenantStore,
        abpDistributedLock,
        distributedEventBus,
        loggerFactory)
    {
        _dataSeeder = dataSeeder;
    }

    protected override async Task SeedAsync(Guid? tenantId)
    {
        await _dataSeeder.SeedAsync(tenantId);
    }
}