# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 4

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode?: string,
    public readonly details?: any,
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}