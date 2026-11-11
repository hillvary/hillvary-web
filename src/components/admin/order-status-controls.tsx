"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["UNPAID", "PAID", "REFUNDED", "FAILED"];

export function OrderStatusControls({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function update(field: "status" | "paymentStatus", value: string) {
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        defaultValue={status}
        disabled={saving}
        onChange={(e) => update("status", e.target.value)}
        className="rounded-full border border-border bg-transparent px-3 py-1.5 text-xs outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        defaultValue={paymentStatus}
        disabled={saving}
        onChange={(e) => update("paymentStatus", e.target.value)}
        className="rounded-full border border-border bg-transparent px-3 py-1.5 text-xs outline-none"
      >
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
