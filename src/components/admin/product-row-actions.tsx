"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductRowActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleDuplicate() {
    setBusy(true);
    await fetch(`/api/admin/products/${productId}/duplicate`, { method: "POST" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <button
        type="button"
        onClick={handleDuplicate}
        disabled={busy}
        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        Duplicate
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
