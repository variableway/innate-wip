# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 27

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