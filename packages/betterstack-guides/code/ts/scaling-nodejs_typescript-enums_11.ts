# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-enums/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/const-enums.ts]
// Const enum for log levels
const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

class Logger {
  private minLevel = LogLevel.Info;

  log(level: LogLevel, message: string): void {
    if (level >= this.minLevel) {
      console.log(`[${level}] ${message}`);
    }
  }
}

const logger = new Logger();

logger.log(LogLevel.Debug, 'This won\'t show');
logger.log(LogLevel.Info, 'Application started');
logger.log(LogLevel.Error, 'Critical error');