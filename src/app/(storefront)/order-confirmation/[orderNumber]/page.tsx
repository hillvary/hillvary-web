import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-accent" strokeWidth={1.5} />
      <h1 className="mt-6 font-display text-3xl tracking-tight">Order Received</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Thank you, {order.customerName}. Your order <span className="font-medium">{order.orderNumber}</span>{" "}
        has been placed. We&apos;ll be in touch at {order.customerEmail} with next steps.
      </p>

      <div className="mt-8 rounded-2xl border border-border p-6 text-left">
        <ul className="flex flex-col gap-2 text-sm">
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

      <Link href="/shop" className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm text-background">
        Continue Shopping
      </Link>
    </div>
  );
}
