export function formatPrice(amount: number, currency = "FRW") {
  const formatted = new Intl.NumberFormat("en-US").format(amount);
  return `${formatted} ${currency}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
