# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 12

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