"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function ApiKeyModal({
  open,
  onClose,
  currentKey,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  currentKey: string | null;
  onSave: (key: string | null) => void;
}) {
  const [value, setValue] = useState(currentKey ?? "");

  if (!open) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(value.trim() || null);
    onClose();
  }

  function handleClear() {
    onSave(null);
    setValue("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fitting-room-api-key-title"
        className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="fitting-room-api-key-title" className="text-sm font-medium">
            Your API key
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Used only for this browser session to generate fitting-room previews — kept in
          memory and never saved to your device or sent anywhere else.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input
            type="password"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste your API key"
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 rounded-full border border-border py-2 text-sm hover:border-foreground"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-foreground py-2 text-sm text-background hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
