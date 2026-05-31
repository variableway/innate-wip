# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label src/invalid-state.ts]
interface UploadingState {
  status: "uploading";
  progress: number;
  filename: string;
}

type UploadState = UploadingState | /* other states... */;

// Try to create uploading state without required fields
const incomplete: UploadState = {
  status: "uploading",
  progress: 50
  // missing filename
};