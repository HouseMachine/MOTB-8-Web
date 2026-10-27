import type { DownloadArtifact } from "./artifacts";

export function downloadMotb8Artifact(
  artifact: DownloadArtifact
): void {
  if (typeof window === "undefined" ||
      typeof document === "undefined") {
    throw new Error("Artifact downloads require a browser");
  }

  if (!artifact.filename ||
      !artifact.content ||
      !artifact.mimeType) {
    throw new Error("Invalid download artifact");
  }

  const blob = new Blob(
    [artifact.content],
    { type: artifact.mimeType }
  );

  const url = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = artifact.filename;
    anchor.style.display = "none";

    document.body.appendChild(anchor);

    try {
      anchor.click();
    } finally {
      anchor.remove();
    }
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
