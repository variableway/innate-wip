# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 11

[label GlobalExceptionHandler.java]
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException ex) {
        
        ErrorResponse error = new ErrorResponse(
            "Validation failed",
            ex.getBindingResult().getFieldErrors()
        );
        return ResponseEntity.badRequest().body(error);
    }
}