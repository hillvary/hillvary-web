"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export function InventoryRow({ productId, initialStock }: { productId: string; initialStock: number }) {
  const router = useRouter();
  const [value, setValue] = useState(initialStock);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (value === initialStock) return;
    setSaving(true);
    await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQuantity: value }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={save}
        className={clsx(
          "w-20 rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground",
          saving && "opacity-60"
        )}
      />
    </div>
  );
}
