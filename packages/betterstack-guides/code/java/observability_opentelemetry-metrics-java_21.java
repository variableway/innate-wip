# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 21

@RestController
public class ApiController {
   private final ExternalApiService apiService;

   public ApiController(ExternalApiService apiService) {
       this.apiService = apiService;
   }

   @GetMapping("/posts")
   public Object getPosts() {
       return apiService.fetchPosts();
   }
}