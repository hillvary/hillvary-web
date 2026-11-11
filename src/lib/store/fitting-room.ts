"use client";

import { create } from "zustand";
import type { ProductCardData } from "@/types/product";
import { generateTryOnImage } from "@/lib/fitting-room/generate-try-on-image";

// TODO(you): point this at a real mannequin/model photo you have the rights
// to use — this is what every garment gets composited onto.
const BASE_MODEL_IMAGE_URL = "/images/fitting-room/base-model.jpg";

const GENERATION_DEBOUNCE_MS = 650;

interface FittingRoomState {
  picks: ProductCardData[];
  isOpen: boolean;
  /** In-memory only — set via the "Your API key" modal, never persisted. */
  apiKey: string | null;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  error: string | null;
  /** Bumped on every pick change/reset; async responses are discarded once
   *  they no longer match this, so a stale request can't clobber a newer
   *  one that resolved (or was reset) first. */
  requestId: number;
  /** Bumped on every addToFittingRoom call so the panel knows to scroll
   *  into view, even if it was already open. */
  scrollSignal: number;

  open: () => void;
  close: () => void;
  toggle: () => void;
  setApiKey: (key: string | null) => void;
  addToFittingRoom: (product: ProductCardData) => void;
  removeFromFittingRoom: (productId: string) => void;
  resetFittingRoom: () => void;
  retry: () => void;
}

type Get = () => FittingRoomState;
type Set = (partial: Partial<FittingRoomState> | ((state: FittingRoomState) => Partial<FittingRoomState>)) => void;

// Held outside the store's state on purpose — these are transient handles
// (a timer id, an in-flight controller), not serializable UI state.
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeController: AbortController | null = null;

function clearPendingGeneration() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  activeController?.abort();
  activeController = null;
}

async function runGeneration(get: Get, set: Set) {
  const { picks, apiKey, requestId: myRequestId } = get();

  if (picks.length === 0) {
    set({ isGenerating: false, generatedImageUrl: null, error: null });
    return;
  }

  if (!apiKey) {
    set({ isGenerating: false, error: "Add your API key to generate a preview." });
    return;
  }

  const controller = new AbortController();
  activeController = controller;
  set({ isGenerating: true, error: null });

  try {
    const result = await generateTryOnImage({
      baseImageUrl: BASE_MODEL_IMAGE_URL,
      garmentImageUrls: picks.map((p) => p.images[0]?.url).filter((url): url is string => Boolean(url)),
      apiKey,
      signal: controller.signal,
    });

    if (get().requestId !== myRequestId) return; // superseded — ignore
    set({ isGenerating: false, generatedImageUrl: result.imageUrl, error: null });
  } catch (err) {
    if (get().requestId !== myRequestId) return; // superseded — ignore
    if (err instanceof DOMException && err.name === "AbortError") return;

    set({
      isGenerating: false,
      error: err instanceof Error ? err.message : "Couldn't update the preview — try again.",
    });
  }
}

function scheduleGeneration(get: Get, set: Set) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runGeneration(get, set);
  }, GENERATION_DEBOUNCE_MS);
}

export const useFittingRoom = create<FittingRoomState>()((set, get) => ({
  picks: [],
  isOpen: false,
  apiKey: null,
  isGenerating: false,
  generatedImageUrl: null,
  error: null,
  requestId: 0,
  scrollSignal: 0,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setApiKey: (key) => set({ apiKey: key }),

  addToFittingRoom: (product) => {
    const alreadyIn = get().picks.some((p) => p.id === product.id);

    set((state) => ({
      isOpen: true,
      scrollSignal: state.scrollSignal + 1,
      picks: alreadyIn ? state.picks : [...state.picks, product],
      requestId: alreadyIn ? state.requestId : state.requestId + 1,
    }));

    if (alreadyIn) return; // caller (ProductCard) shows the "already added" toast

    clearPendingGeneration();
    scheduleGeneration(get, set);
  },

  removeFromFittingRoom: (productId) => {
    set((state) => ({
      picks: state.picks.filter((p) => p.id !== productId),
      requestId: state.requestId + 1,
    }));
    clearPendingGeneration();
    scheduleGeneration(get, set);
  },

  resetFittingRoom: () => {
    clearPendingGeneration();
    set((state) => ({
      picks: [],
      generatedImageUrl: null,
      error: null,
      isGenerating: false,
      requestId: state.requestId + 1,
    }));
  },

  retry: () => {
    clearPendingGeneration();
    set((state) => ({ requestId: state.requestId + 1, error: null }));
    void runGeneration(get, set); // manual retry fires immediately, no debounce
  },
}));
