import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
        >
          New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-3">
                    <div className="relative h-10 w-9 shrink-0 overflow-hidden rounded-md bg-surface">
                      {product.images[0] && (
                        <Image src={product.images[0].url} alt="" fill className="object-cover" sizes="36px" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{formatPrice(product.price, product.currency)}</td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                  {product.featured && (
                    <span className="ml-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions productId={product.id} />
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
