# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 10

@Injectable()
export class DataSyncService {
  constructor(private readonly logger: Logger) {}

  @Cron('0 */2 * * * *')
  async syncData() {
    try {
      // Synchronization logic
      await this.dataService.performSync();
      this.logger.log('Data synchronization completed');
    } catch (error) {
      this.logger.error(
        `Data synchronization failed: ${error.message}`,
        error.stack,
      );
      // Optional: Notify monitoring systems
    }
  }
}