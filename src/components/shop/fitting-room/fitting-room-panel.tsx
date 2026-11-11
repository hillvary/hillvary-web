"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Shirt, Loader2 } from "lucide-react";
import { useFittingRoom } from "@/lib/store/fitting-room";
import { ApiKeyModal } from "./api-key-modal";

export function FittingRoomPanel() {
  const isOpen = useFittingRoom((s) => s.isOpen);
  const picks = useFittingRoom((s) => s.picks);
  const apiKey = useFittingRoom((s) => s.apiKey);
  const isGenerating = useFittingRoom((s) => s.isGenerating);
  const generatedImageUrl = useFittingRoom((s) => s.generatedImageUrl);
  const error = useFittingRoom((s) => s.error);
  const scrollSignal = useFittingRoom((s) => s.scrollSignal);
  const close = useFittingRoom((s) => s.close);
  const removeFromFittingRoom = useFittingRoom((s) => s.removeFromFittingRoom);
  const resetFittingRoom = useFittingRoom((s) => s.resetFittingRoom);
  const retry = useFittingRoom((s) => s.retry);
  const setApiKey = useFittingRoom((s) => s.setApiKey);

  const panelRef = useRef<HTMLDivElement>(null);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  // Scroll the panel into view whenever a hanger click opens it (or adds to
  // an already-open one) — scrollSignal changes on every addToFittingRoom.
  useEffect(() => {
    if (isOpen) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [scrollSignal, isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="border-b border-border py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Fitting room</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tap the hanger on any product to wear it.
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close fitting room"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Preview */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface">
        {generatedImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external/data: URLs from the generation API, not a local asset
          <img
            src={generatedImageUrl}
            alt="Your fitting room preview"
            className="h-full w-full object-cover"
          />
        ) : picks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <Shirt className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground">Add a piece to see it on the model.</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
            {isGenerating ? "Generating your preview…" : "Preview will appear here."}
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-foreground" aria-label="Generating" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
          <span className="text-xs text-muted-foreground">{error}</span>
          <button
            type="button"
            onClick={retry}
            className="shrink-0 text-xs font-medium text-foreground hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Picks tray */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium">
            {picks.length} piece{picks.length === 1 ? "" : "s"}
          </p>
          {picks.length > 0 && (
            <p className="text-[11px] text-muted-foreground">Add another piece and it goes on top.</p>
          )}
        </div>

        {picks.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {picks.map((product) => (
              <div key={product.id} className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                {product.images[0]?.url && (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFromFittingRoom(product.id)}
                  aria-label={`Remove ${product.name}`}
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background/90 text-foreground"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setKeyModalOpen(true)}
          className="flex-1 rounded-full border border-border px-3 py-2 text-xs font-medium hover:border-foreground"
        >
          {apiKey ? "API key set" : "Your API key"}
        </button>
        <button
          type="button"
          onClick={resetFittingRoom}
          disabled={picks.length === 0 && !generatedImageUrl}
          className="flex-1 rounded-full border border-border px-3 py-2 text-xs font-medium hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start over
        </button>
      </div>

      <ApiKeyModal
        open={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        currentKey={apiKey}
        onSave={setApiKey}
      />
    </div>
  );
}
