"use client";

import { useId } from "react";

interface JsonFilePickerProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function JsonFilePicker({
  label,
  file,
  onChange,
  disabled = false
}: JsonFilePickerProps) {
  const id = useId();

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        id={id}
        type="file"
        accept=".json,application/json"
        required
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.files?.[0] ?? null)
        }
        className="peer"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      />

      <label
        htmlFor={id}
        className="inline-flex min-h-[50px] min-w-[205px] cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#baccc0] bg-white px-6 py-3 text-sm font-semibold text-[#174b3a] transition-colors hover:border-[#174b3a] hover:bg-[#eaf1e9] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#174b3a] peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        <span aria-hidden="true">â†‘</span>
        Choose JSON File
      </label>

      <p className="mt-2 break-all text-sm text-[#5e6e64]">
        {file ? file.name : "No file selected"}
      </p>
    </div>
  );
}
