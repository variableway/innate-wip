# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/functions.ts]
interface Transformer {
  (input: string): string;
}

interface Validator {
  (input: string): boolean;
}

interface Processor {
  transform: Transformer;
  validate: Validator;
}

const uppercase: Transformer = (input) => input.toUpperCase();
const lowercase: Transformer = (input) => input.toLowerCase();

const notEmpty: Validator = (input) => input.length > 0;
const isEmail: Validator = (input) => input.includes("@");

function processData(data: string, processor: Processor): string | null {
  if (!processor.validate(data)) {
    return null;
  }
  return processor.transform(data);
}

const emailProcessor: Processor = {
  transform: lowercase,
  validate: isEmail
};

console.log(processData("USER@EXAMPLE.COM", emailProcessor));
console.log(processData("invalid", emailProcessor));