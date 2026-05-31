# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label src/state-machine.ts]
interface IdleState {
  status: "idle";
}

interface UploadingState {
  status: "uploading";
  progress: number;
  filename: string;
}

interface CompletedState {
  status: "completed";
  fileUrl: string;
  uploadedAt: Date;
}

interface FailedState {
  status: "failed";
  error: string;
  retryCount: number;
}

type UploadState = IdleState | UploadingState | CompletedState | FailedState;

function renderUploadUI(state: UploadState): string {
  switch (state.status) {
    case "idle":
      return "Ready to upload";

    case "uploading":
      return `Uploading ${state.filename}: ${state.progress}%`;

    case "completed":
      return `Upload finished: ${state.fileUrl}`;

    case "failed":
      return `Upload failed: ${state.error} (retry ${state.retryCount})`;
  }
}

// Simulate state transitions
const states: UploadState[] = [
  { status: "idle" },
  { status: "uploading", progress: 45, filename: "document.pdf" },
  { status: "completed", fileUrl: "https://cdn.example.com/doc.pdf", uploadedAt: new Date() },
  { status: "failed", error: "Network timeout", retryCount: 2 }
];

states.forEach(state => {
  console.log(renderUploadUI(state));
});