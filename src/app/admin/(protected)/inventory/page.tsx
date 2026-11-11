import { prisma } from "@/lib/prisma";
import { InventoryRow } from "@/components/admin/inventory-row";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, stockQuantity: true, active: true },
    orderBy: { stockQuantity: "asc" },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Inventory</h1>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.stockQuantity === 0
                        ? "bg-red-100 text-red-700"
                        : p.stockQuantity <= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.stockQuantity === 0 ? "Out of stock" : p.stockQuantity <= 5 ? "Low stock" : "In stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <InventoryRow productId={p.id} initialStock={p.stockQuantity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No products yet.</p>
        )}
      </div>
    </div>
  );
}
