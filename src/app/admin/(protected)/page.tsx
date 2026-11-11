import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalProducts,
    totalCategories,
    featuredProducts,
    outOfStock,
    lowStock,
    stockAgg,
    pendingOrders,
    totalOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { stockQuantity: 0 } }),
    prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } }),
    prisma.product.aggregate({ _sum: { stockQuantity: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count(),
  ]);

  return {
    totalProducts,
    totalCategories,
    featuredProducts,
    outOfStock,
    lowStock,
    totalUnits: stockAgg._sum.stockQuantity ?? 0,
    pendingOrders,
    totalOrders,
  };
}

function StatCard({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const content = (
    <div className="rounded-2xl border border-border p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Dashboard Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} href="/admin/products" />
        <StatCard label="Categories" value={stats.totalCategories} href="/admin/categories" />
        <StatCard label="Featured Products" value={stats.featuredProducts} href="/admin/products" />
        <StatCard label="Units in Stock" value={stats.totalUnits} href="/admin/inventory" />
        <StatCard label="Low Stock (≤5)" value={stats.lowStock} href="/admin/inventory" />
        <StatCard label="Out of Stock" value={stats.outOfStock} href="/admin/inventory" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} href="/admin/orders" />
        <StatCard label="Total Orders" value={stats.totalOrders} href="/admin/orders" />
      </div>
    </div>
  );
}
