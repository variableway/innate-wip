#  NestJS Error Handling Patterns

When your application encounters an unexpected failure—whether due to a third-party service timeout or a malformed request slipping past validation—it often results in frustrated users, frantic debugging, and potential business losses.  

To prevent these disruptions, you should implement effective error-handling strategies that anticipate failures, manage them gracefully, and keep your application stable under pressure.  

This article explores NestJS error-handling patterns you can use to build resilient applications, minimize downtime, and improve overall system reliability.

## What are errors in NestJS?  

When your NestJS application encounters an error, understanding its type is crucial. Different errors require different handling strategies, and recognizing these categories is the first step toward building a system that can recover gracefully and remain reliable under pressure.

### Operational errors

These are the everyday hiccups your application must handle gracefully. 

For example, a customer tries to access their order history, but their authentication token expired 30 seconds ago. Your application shouldn't crash—it should guide them back to login. That's handling an operational error.

Other real-world examples include:

- A user attempts to access a deleted account (`404 Not Found`)
- A customer submits payment with an expired credit card (`400 Bad Request`)
- Your third-party email service goes down during a critical notification (`503 Service Unavailable`)
- A client's API token lacks permissions for the requested resource (`403 Forbidden`)

### Programmer errors

Unlike operational errors, these stem directly from code issues. They represent mistakes that shouldn't exist in production and signal the need for fixes rather than runtime accommodations.


The errors often include:

- Type mismatches that TypeScript should have caught but didn't due to improper typing
- Circular dependency injections causing your NestJS container to enter infinite loops
- Forgetting to apply `@Injectable()` decorators to providers
- Using `async/await` incorrectly, causing promise chains to break

### System errors

System errors occur when the underlying infrastructure supporting your application fails. These issues arise at the boundary between your code and its execution environment, often beyond direct control. 


Critical examples include:

- Your database connection pool suddenly exhausts during peak traffic
- The filesystem where you store uploaded files runs out of space
- Memory consumption spikes unexpectedly, triggering container limits
- Network partitions isolate your services from communicating properly

With this understanding of what can go wrong, you must build defenses that address each error category differently. A one-size-fits-all approach won't cut it—you need targeted strategies that turn potential disasters into controlled situations.

## Leveraging NestJS exception filters

NestJS provides a powerful feature called Exception Filters that centralizes error handling. Exception filters catch exceptions thrown from your controllers, pipes, guards, and interceptors, allowing you to process errors consistently.

The framework includes a built-in `HttpException` class for HTTP errors, which should be used for operational errors:

```typescript
@Get('users/:id')
findOne(@Param('id') id: string) {
  const user = this.usersService.findOne(id);
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  return user;
}
```

For more specific HTTP errors, NestJS provides built-in exceptions like `NotFoundException` and `BadRequestException`:

```typescript
@Get('users/:id')
findOne(@Param('id') id: string) {
  const user = this.usersService.findOne(id);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}
```

While these built-in exceptions cover many scenarios, creating a global exception filter provides more control over error responses:

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

Register this filter globally in your `main.ts` file:

```typescript
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

This ensures all unhandled exceptions are captured and formatted consistently, enhancing error visibility while protecting sensitive information.

## Creating custom exception classes

NestJS applications often need specialized error handling beyond the built-in exceptions. Custom exception classes provide structured error responses for different application domains.

Start by creating a base application exception:

```typescript
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
```

Then extend this base class for domain-specific errors:

```typescript
export class ValidationException extends AppException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class ResourceNotFoundException extends AppException {
  constructor(resourceType: string, identifier: string | number) {
    super(
      `${resourceType} with identifier ${identifier} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
    );
  }
}

export class AuthenticationException extends AppException {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
  }
}
```

These specialized exceptions provide context-rich error responses:

```typescript
@Get('products/:id')
async findProduct(@Param('id') id: string) {
  const product = await this.productsService.findOne(id);
  if (!product) {
    throw new ResourceNotFoundException('Product', id);
  }
  return product;
}
```

The resulting error response includes more meaningful information:

```json
{
  "message": "Product with identifier abc123 not found",
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2023-05-16T14:30:45.123Z",
  "statusCode": 404
}
```

This structured approach improves client-side error handling and debugging while maintaining a consistent response format.

## Handling asynchronous errors in NestJS

NestJS heavily utilizes `async/await` patterns, which require special attention for error handling. Fortunately, NestJS automatically catches and processes exceptions from async methods in controllers.

Here's how NestJS handles asynchronous errors internally:

```typescript
@Get('users')
async findAll() {
  // If this throws an error, NestJS will catch and process it
  return await this.usersService.findAll();
}
```

However, when working with promises directly, you should implement proper error handling:

```typescript
@Get('data')
async fetchExternalData() {
  try {
    const response = await this.httpService.get('https://api.example.com/data').toPromise();
    return response.data;
  } catch (error) {
    if (error.response) {
      // External API returned an error
      throw new ServiceUnavailableException('External service error');
    }
    if (error.request) {
      // Request was made but no response received
      throw new GatewayTimeoutException('External service timeout');
    }
    // Something else caused the error
    throw new InternalServerErrorException('Failed to process request');
  }
}
```

For operations running outside the request context (like scheduled tasks or event subscribers), use `try/catch` blocks and proper logging:

```typescript
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
```

This approach ensures that async errors are properly contained and don't crash your application.

## Implementing timeout handling with RxJS

NestJS integrates well with RxJS, which provides powerful tools for handling timeouts in HTTP requests and other async operations. Using timeouts prevents operations from hanging indefinitely.

Here's how to implement timeout handling with the HttpService:

```typescript
@Injectable()
export class ExternalApiService {
  constructor(private httpService: HttpService) {}

  async fetchData(): Promise<any> {
    try {
      const response = await this.httpService
        .get('https://api.example.com/data')
        .pipe(
          timeout(5000), // 5 second timeout
          catchError(err => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException('External API request timed out');
            }
            throw new ServiceUnavailableException('External API error');
          }),
        )
        .toPromise();
      
      return response.data;
    } catch (error) {
      // Re-throw the transformed errors from our pipe
      throw error;
    }
  }
}
```

For more advanced scenarios, implement retry logic with exponential backoff:

```typescript
async fetchWithRetry(): Promise<any> {
  return this.httpService
    .get('https://api.example.com/data')
    .pipe(
      timeout(3000),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // Exponential backoff: 1s, 2s, 4s
          return timer(Math.pow(2, retryCount - 1) * 1000);
        },
      }),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('Request timed out after retries');
        }
        throw new ServiceUnavailableException('Service unavailable after retries');
      }),
    )
    .toPromise();
}
```

This pattern ensures your application remains responsive even when external dependencies fail or become slow.

## Implementing rate limiting

Preventing system overload is a critical aspect of error prevention. NestJS can leverage `@nestjs/throttler` to implement rate limiting at both the application and route levels.

First, install the package:

```command
npm install --save @nestjs/throttler
```

Then configure it in your application module:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,           // time-to-live in seconds
      limit: 10,         // max number of requests within TTL
    }),
  ],
})
export class AppModule {}
```

Apply rate limiting to specific controllers:

```typescript
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  // Routes here will be rate-limited
}
```

You can also customize rate limits for specific routes:

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // Override global settings for this route
  @Throttle(3, 60) // 3 requests per 60 seconds
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    // Login logic
  }
}
```

For more sophisticated rate limiting, consider implementing IP-based or user-based throttling through a custom guard:

```typescript
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // Use user ID if authenticated, otherwise IP
    return req.user ? `user-${req.user.id}` : req.ip;
  }
}
```

Proper rate limiting prevents denial-of-service scenarios and ensures your application remains available for all users.


## Final thoughts

Error handling is fundamental to reliable NestJS applications, not just a last-minute safeguard. The discussed patterns help turn system failures into controlled events, ensuring stability and user confidence.

While the official NestJS documentation provides foundational concepts on exception filters and error handling, implementation requires thoughtful integration within your specific architecture. 

Treating errors as expected parts of your application flow allows you to create systems that bend rather than break under pressure—the hallmark of production-grade software.