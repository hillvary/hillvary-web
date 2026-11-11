import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
