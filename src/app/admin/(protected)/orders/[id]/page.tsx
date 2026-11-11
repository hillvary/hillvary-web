import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusControls } from "@/components/admin/order-status-controls";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-2xl">{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Placed {order.createdAt.toLocaleString()}
      </p>

      <div className="mb-6">
        <OrderStatusControls orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-border p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          {order.customerPhone && <p className="text-sm text-muted-foreground">{order.customerPhone}</p>}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Shipping Address</p>
          <p className="text-sm">{order.shippingAddress ?? "—"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-6">
        <h2 className="mb-4 text-sm font-medium">Items</h2>
        <ul className="flex flex-col gap-3 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} {item.size && `· ${item.size}`} {item.color && `· ${item.color}`} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-medium">
          <span>Total</span>
          <span>{formatPrice(order.total, order.currency)}</span>
        </div>
      </div>
    </div>
  );
}
