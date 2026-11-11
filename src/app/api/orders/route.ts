import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";
import { generateOrderNumber } from "@/lib/order-number";
import { OrderStatus } from "@/generated/prisma/client";

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().int().positive(),
  price: z.number().int().nonnegative(),
});

const createSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  currency: z.string().default("FRW"),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items, ...customer } = parsed.data;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: customer.customerName,
        customerEmail: customer.customerEmail,
        customerPhone: customer.customerPhone,
        shippingAddress: customer.shippingAddress,
        currency: customer.currency,
        subtotal,
        total: subtotal,
        items: { create: items },
      },
      include: { items: true },
    });
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && (Object.values(OrderStatus) as string[]).includes(statusParam)
      ? (statusParam as OrderStatus)
      : undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
