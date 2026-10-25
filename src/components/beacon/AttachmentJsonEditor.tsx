"use client";

import { useState } from "react";

interface AttachmentJsonEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  onValidityChange: (valid: boolean) => void;
  draftText?: string;
  onDraftTextChange: (text: string) => void;
}

export default function AttachmentJsonEditor({
  value,
  onChange,
  onValidityChange,
  draftText,
  onDraftTextChange,
}: AttachmentJsonEditorProps) {
  const [text, setText] = useState(() =>
    draftText ?? JSON.stringify(value, null, 2)
  );
  const [error, setError] = useState("");

  function handleChange(nextText: string) {
    setText(nextText);
    onDraftTextChange(nextText);

    try {
      const parsed: unknown = JSON.parse(nextText);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        setError("Attachment data must be a JSON object.");
        onValidityChange(false);
        return;
      }

      setError("");
      onValidityChange(true);
      onChange(parsed as Record<string, unknown>);
    } catch {
      setError("Invalid JSON. Check the syntax before continuing.");
      onValidityChange(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Attachment data (JSON object)
      </label>

      <textarea
        aria-label="Attachment JSON data"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "attachment-json-error" : undefined}
        rows={6}
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        placeholder='{"key": "value"}'
        className="w-full rounded-lg border border-[#dce4dc] bg-white p-3 font-mono text-sm"
      />

      {error ? (
        <p
          id="attachment-json-error"
          role="alert"
          className="mt-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-[#5e6e64]">
          Valid JSON object. Changes are held locally in your browser.
        </p>
      )}
    </div>
  );
}
