"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImageUploader, type UploadedImage } from "./product-image-uploader";

interface Option {
  id: string;
  label: string;
}

export interface ProductFormInitial {
  id?: string;
  name: string;
  description: string;
  designDetails: string[];
  price: number;
  discountPrice: number | null;
  sku: string;
  material: string;
  careInstructions: string;
  stockQuantity: number;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  categoryId: string | null;
  sizeIds: string[];
  colorIds: string[];
  images: UploadedImage[];
}

const EMPTY: ProductFormInitial = {
  name: "",
  description: "",
  designDetails: [],
  price: 0,
  discountPrice: null,
  sku: "",
  material: "",
  careInstructions: "",
  stockQuantity: 0,
  featured: false,
  newArrival: false,
  active: true,
  categoryId: null,
  sizeIds: [],
  colorIds: [],
  images: [],
};

export function ProductForm({
  initial,
  categories,
  sizes,
  colors,
}: {
  initial?: ProductFormInitial;
  categories: Option[];
  sizes: Option[];
  colors: (Option & { hexCode: string })[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormInitial>(initial ?? EMPTY);
  const [designText, setDesignText] = useState((initial?.designDetails ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?.id);

  function toggleId(list: string[], id: string) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      designDetails: designText.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.images.map((img) => ({ url: img.url, publicId: img.publicId })),
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(typeof data?.error === "string" ? data.error : "Could not save product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          SKU
          <input
            required
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        Description
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Design details (one per line)
        <textarea
          rows={4}
          value={designText}
          onChange={(e) => setDesignText(e.target.value)}
          className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          Price (FRW)
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Discount price
          <input
            type="number"
            min={0}
            value={form.discountPrice ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, discountPrice: e.target.value ? Number(e.target.value) : null }))
            }
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Stock quantity
          <input
            required
            type="number"
            min={0}
            value={form.stockQuantity}
            onChange={(e) => setForm((f) => ({ ...f, stockQuantity: Number(e.target.value) }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Material
          <input
            value={form.material}
            onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Care instructions
          <input
            value={form.careInstructions}
            onChange={(e) => setForm((f) => ({ ...f, careInstructions: e.target.value }))}
            className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        Category
        <select
          value={form.categoryId ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value || null }))}
          className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="mb-2 text-sm">Sizes</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, sizeIds: toggleId(f.sizeIds, s.id) }))}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                form.sizeIds.includes(s.id) ? "border-foreground bg-foreground text-background" : "border-border"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm">Colors</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, colorIds: toggleId(f.colorIds, c.id) }))}
              className={`h-8 w-8 rounded-full border-2 ${
                form.colorIds.includes(c.id) ? "border-accent" : "border-border"
              }`}
              style={{ backgroundColor: c.hexCode }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.newArrival}
            onChange={(e) => setForm((f) => ({ ...f, newArrival: e.target.checked }))}
          />
          New Arrival
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Active (visible on storefront)
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm">Images</p>
        <ProductImageUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </form>
  );
}
