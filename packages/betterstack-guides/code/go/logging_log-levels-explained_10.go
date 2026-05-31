# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: go
# Normalized: go
# Block index: 10

package main

import (
	logger "github.com/rs/zerolog/log"
)

func complexCalculation(input int) int {
	logger.Trace().Msg("Entering complexCalculation() function")

	logger.Trace().Int("input", input).Msgf("Received input: %d", input)

	// step 1
	result := input * 2

	logger.Trace().
		Int("step1-result", result).
		Msg("Intermediate value after step 1")

	// step 2
	result += 10

	logger.Trace().
		Int("step2-result", result).
		Msg("Intermediate value after step 2")

	// final result
	result *= 3

	logger.Trace().
		Int("final-result", result).
		Msgf("Final result is: %d", result)

	logger.Trace().Msg("Exiting complexCalculation() function")

	return result
}

func main() {
	result := complexCalculation(5)

	logger.Info().Int("result", result).Msg("Calculation completed")
}