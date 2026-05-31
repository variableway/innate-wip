# Source: https://betterstack.com/community/guides/scaling-nodejs/webassembly-web-apps/
# Original language: cpp
# Normalized: cpp
# Block index: 13

[label math_operations.cpp]
#include <emscripten.h>

extern "C" {
    
EMSCRIPTEN_KEEPALIVE
double fibonacci_iterative(int n) {
    if (n <= 1) return n;
    double prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        double next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

EMSCRIPTEN_KEEPALIVE
double prime_count(int limit) {
    if (limit < 2) return 0;
    int count = 0;
    for (int num = 2; num <= limit; num++) {
        bool is_prime = true;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) {
                is_prime = false;
                break;
            }
        }
        if (is_prime) count++;
    }
    return count;
}

}