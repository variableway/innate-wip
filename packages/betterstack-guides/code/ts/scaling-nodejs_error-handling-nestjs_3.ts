# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 3

import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();