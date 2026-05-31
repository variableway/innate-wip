# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 9

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