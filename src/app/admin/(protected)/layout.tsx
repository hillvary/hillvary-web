import { redirect } from "next/navigation";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminThemeToggle } from "@/components/admin/theme-toggle";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/admin/login");
    }
    throw error;
  }

  return (
    <div id="admin-shell" className="dark:bg-surface-dark dark:text-background">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <header className="flex items-center justify-end border-b border-border px-8 py-4">
            <AdminThemeToggle />
          </header>
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
