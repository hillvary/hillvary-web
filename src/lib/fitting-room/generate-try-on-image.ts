export interface GenerateTryOnImageParams {
  /** The mannequin/model photo everything gets composited onto. */
  baseImageUrl: string;
  /** Ordered garment image URLs — index 0 is the base garment, later
   *  entries are layered on top of it (outerwear over a base tee,
   *  footwear on feet, etc.). */
  garmentImageUrls: string[];
  /** Read from in-memory state only — never persisted, never hardcoded. */
  apiKey: string;
  /** Aborts the underlying request when a newer pick supersedes this one. */
  signal?: AbortSignal;
}

export interface GenerateTryOnImageResult {
  /** The resulting composited image — a hosted URL or a data: URL both work,
   *  the UI just drops it straight into an <img src>. */
  imageUrl: string;
}

/**
 * TODO(you): wire this up to a real image-editing/generation API capable of
 * multi-image composition — e.g. Google's Gemini 2.5 Flash Image ("nano
 * banana") model, or a dedicated virtual try-on API if you already have one.
 *
 * Contract the rest of the app is already built against (see
 * `src/lib/store/fitting-room.ts`):
 *
 *   - Called once per settled pick-set (debounced ~650ms, see
 *     GENERATION_DEBOUNCE_MS in the store) with the *full* ordered
 *     `garmentImageUrls` list every time — not incrementally. Re-send the
 *     same `baseImageUrl` and the same instructions each call so the
 *     provider's output stays visually consistent (same pose/background)
 *     across the session.
 *   - Must reject (throw) on failure — network error, non-2xx, missing or
 *     invalid `apiKey`. The store already catches this, keeps the last
 *     good `generatedImageUrl` on screen, and surfaces your thrown
 *     message in the panel's error banner + Retry button. Don't swallow
 *     errors here or silently fall back to un-composited layering.
 *   - Must respect `signal` — abort the underlying fetch when it fires
 *     (the store aborts the previous in-flight call whenever picks change
 *     again before it resolves).
 *   - Resolve with `{ imageUrl }` pointing at the composited result.
 *
 * Example shape for Gemini 2.5 Flash Image (multi-image input) — replace
 * wholesale with whatever provider you land on, this is just to show the
 * request/response shape the rest of the app expects you to bridge:
 *
 *   const res = await fetch(
 *     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
 *     {
 *       method: "POST",
 *       signal,
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({
 *         contents: [{
 *           parts: [
 *             {
 *               text:
 *                 "Composite these garments onto the model photo as one " +
 *                 "realistic outfit, in the given order (later items layer " +
 *                 "on top — outerwear over base layers, footwear on feet). " +
 *                 "Keep the model's pose, framing, and background identical " +
 *                 "to the base photo.",
 *             },
 *             { inlineData: { mimeType: "image/jpeg", data: await urlToBase64(baseImageUrl) } },
 *             ...await Promise.all(
 *               garmentImageUrls.map(async (url) => ({
 *                 inlineData: { mimeType: "image/jpeg", data: await urlToBase64(url) },
 *               })),
 *             ),
 *           ],
 *         }],
 *       }),
 *     },
 *   );
 *   if (!res.ok) throw new Error(`Try-on generation failed (${res.status})`);
 *   const data = await res.json();
 *   // Gemini image-output comes back as inlineData on a response part —
 *   // turn it into a data: URL (or upload it and return a hosted URL).
 *   const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
 *   if (!part) throw new Error("No image returned");
 *   return { imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` };
 */
export async function generateTryOnImage({
  apiKey,
}: GenerateTryOnImageParams): Promise<GenerateTryOnImageResult> {
  if (!apiKey) {
    throw new Error("Add your API key first.");
  }

  // ---- STUB: no real provider wired up yet. ----
  // Replace this whole function body with a real call per the TODO above.
  throw new Error(
    "generateTryOnImage is a stub — wire it up in src/lib/fitting-room/generate-try-on-image.ts",
  );
}
