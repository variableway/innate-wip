# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 11

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