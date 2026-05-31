# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label src/date-handler.ts]
import { format, addDays } from "date-fns";

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getNextWeek(date: Date): Date {
  return addDays(date, 7);
}

export function displayNextWeek(): void {
  const today = new Date();
  const nextWeek = getNextWeek(today);
  console.log(`Today: ${formatDate(today)}`);
  console.log(`Next week: ${formatDate(nextWeek)}`);
}