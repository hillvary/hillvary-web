"use client";

import { useState } from "react";

interface SettingsData {
  siteName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  storeAddress: string | null;
  aboutText: string | null;
}

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  function field(key: keyof SettingsData, label: string, type = "text") {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label}
        <input
          type={type}
          value={form[key] ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
        />
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      {field("siteName", "Site name")}
      {field("contactEmail", "Contact email", "email")}
      {field("contactPhone", "Contact phone")}
      {field("whatsappUrl", "WhatsApp URL")}
      {field("instagramUrl", "Instagram URL")}
      {field("tiktokUrl", "TikTok URL")}
      {field("storeAddress", "Store address")}
      <label className="flex flex-col gap-1.5 text-sm">
        About text
        <textarea
          rows={4}
          value={form.aboutText ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, aboutText: e.target.value }))}
          className="rounded-xl border border-border bg-transparent px-4 py-2.5 outline-none focus:border-foreground"
        />
      </label>

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save Settings"}
      </button>
    </form>
  );
}
