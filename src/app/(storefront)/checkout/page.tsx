"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: form.address,
          currency: items[0]?.currency ?? "FRW",
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not place order");
      }

      const order = await res.json();
      clear();
      router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl tracking-tight">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>
          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
          />
          <textarea
            required
            rows={3}
            placeholder="Shipping address"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 w-full rounded-full bg-accent py-3.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
          >
            {status === "loading" ? "Placing order..." : "Place Order"}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Payment is arranged after order confirmation — our team will reach out with next steps.
          </p>
        </form>

        <div className="rounded-2xl border border-border p-6">
          <h2 className="mb-4 text-sm font-medium">Order Summary</h2>
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.color} · {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(item.price * item.quantity, item.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm font-medium">
            <span>Total</span>
            <span>{formatPrice(subtotal(), items[0]?.currency ?? "FRW")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
