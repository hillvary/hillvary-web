import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER = (label: string, bg = "dedad0", fg = "16150f") =>
  `https://placehold.co/900x1100/${bg}/${fg}?text=${encodeURIComponent(label)}`;

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@hillvary.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Hillvary Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  const categories = await Promise.all(
    [
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Hoodies & Jackets", slug: "hoodies-jackets" },
      { name: "Shorts", slug: "shorts" },
      { name: "Tanks", slug: "tanks" },
    ].map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  );

  const sizeLabels = ["S", "M", "L", "XL", "2XL", "3XL"];
  const sizes = await Promise.all(
    sizeLabels.map((label, i) =>
      prisma.size.upsert({
        where: { label },
        update: {},
        create: { label, sortOrder: i },
      })
    )
  );

  const colorDefs = [
    { name: "Black", hexCode: "#111111" },
    { name: "White", hexCode: "#F5F5F0" },
  ];
  const colors = await Promise.all(
    colorDefs.map((c) =>
      prisma.color.upsert({ where: { name: c.name }, update: {}, create: c })
    )
  );

  const findCategory = (slug: string) => categories.find((c) => c.slug === slug)!;
  const sizeIds = (labels: string[]) =>
    sizes.filter((s) => labels.includes(s.label)).map((s) => ({ sizeId: s.id }));
  const colorIds = (names: string[]) =>
    colors.filter((c) => names.includes(c.name)).map((c) => ({ colorId: c.id }));

  const productDefs = [
    {
      name: "God is Love Vintage Premium Tank",
      slug: "god-is-love-vintage-premium-tank",
      description:
        "Built for performance. Grounded in purpose. The Core Base Layer Tee combines next-level compression technology with a faith-centered design — engineered for athletes who train for more than strength alone.",
      designDetails: [
        "Moisture-wicking and quick-drying",
        "Second-skin fit for enhanced performance",
        "Flatlock seams for reduced friction",
        "Reflective Hillvary logo",
        '"For Christ & Kingdom" back-neck print detail',
        "Ideal for training, layering, or competition days",
      ],
      price: 15000,
      sku: "HLV-TANK-001",
      material: "88% Polyester, 12% Elastane",
      careInstructions: "Machine wash cold, do not bleach, tumble dry low.",
      stockQuantity: 42,
      featured: true,
      newArrival: true,
      categorySlug: "tanks",
      colors: ["Black", "White"],
      sizes: sizeLabels,
    },
    {
      name: "For Christ & Kingdom Performance Tee",
      slug: "for-christ-kingdom-performance-tee",
      description:
        "A lightweight training tee with a faith-forward back print — built to move with you through every rep and every season.",
      designDetails: [
        "Breathable jersey knit",
        "Regular relaxed fit",
        '"For Christ Kingdom" chest print',
        "Reinforced collar",
      ],
      price: 15000,
      sku: "HLV-TEE-002",
      material: "100% Cotton",
      careInstructions: "Machine wash cold with like colors.",
      stockQuantity: 30,
      featured: true,
      newArrival: false,
      categorySlug: "t-shirts",
      colors: ["Black", "White"],
      sizes: sizeLabels,
    },
    {
      name: "Hillvary Wordmark Tee",
      slug: "hillvary-wordmark-tee",
      description:
        "A clean, everyday tee carrying the Hillvary wordmark — simple, durable, and made for daily wear.",
      designDetails: [
        "Heavyweight cotton jersey",
        "Boxy relaxed fit",
        "Front wordmark print",
      ],
      price: 15000,
      sku: "HLV-TEE-003",
      material: "100% Cotton",
      careInstructions: "Machine wash cold, tumble dry low.",
      stockQuantity: 18,
      featured: true,
      newArrival: true,
      categorySlug: "t-shirts",
      colors: ["Black", "White"],
      sizes: sizeLabels,
    },
    {
      name: "Kingdom Training Shorts",
      slug: "kingdom-training-shorts",
      description:
        "Lightweight training shorts with a zip pocket and Hillvary leg print — built for movement, made for mission.",
      designDetails: [
        "Quick-dry woven shell",
        "Zip security pocket",
        "Elastic drawcord waistband",
      ],
      price: 18000,
      sku: "HLV-SHT-001",
      material: "100% Recycled Polyester",
      careInstructions: "Machine wash cold, hang dry.",
      stockQuantity: 25,
      featured: false,
      newArrival: true,
      categorySlug: "shorts",
      colors: ["Black"],
      sizes: sizeLabels,
    },
    {
      name: "Armor of Light Zip Jacket",
      slug: "armor-of-light-zip-jacket",
      description:
        "A full-zip training jacket for cool mornings and long walks of faith — wind-resistant with a subtle Hillvary mark.",
      designDetails: [
        "Wind-resistant woven shell",
        "Full front zip",
        "Zip hand pockets",
      ],
      price: 32000,
      sku: "HLV-JKT-001",
      material: "92% Polyester, 8% Elastane",
      careInstructions: "Machine wash cold, do not iron print.",
      stockQuantity: 12,
      featured: false,
      newArrival: false,
      categorySlug: "hoodies-jackets",
      colors: ["Black"],
      sizes: sizeLabels,
    },
    {
      name: "Faithful Sleeveless Compression Top",
      slug: "faithful-sleeveless-compression-top",
      description:
        "Sleeveless compression top for lifting days — locked-in fit with a small chest mark, nothing in the way of the work.",
      designDetails: [
        "Four-way stretch compression fabric",
        "Sleeveless cut",
        "Small chest mark",
      ],
      price: 16000,
      sku: "HLV-TANK-002",
      material: "85% Nylon, 15% Spandex",
      careInstructions: "Machine wash cold, do not bleach.",
      stockQuantity: 20,
      featured: false,
      newArrival: false,
      categorySlug: "tanks",
      colors: ["Black", "White"],
      sizes: sizeLabels,
    },
  ];

  // Real product photography, keyed by slug — falls back to the placeholder
  // generator for any product that doesn't have real shots yet.
  const REAL_IMAGES: Record<string, { url: string; alt: string }[]> = {};

  for (const [i, p] of productDefs.entries()) {
    const category = findCategory(p.categorySlug);
    const images =
      REAL_IMAGES[p.slug]?.map((img, position) => ({
        url: img.url,
        publicId: `seed/${p.slug}-${position + 1}`,
        position,
        alt: img.alt,
      })) ?? [
        { url: PLACEHOLDER(p.name, i % 2 === 0 ? "dedad0" : "e9e5db"), publicId: `seed/${p.slug}-1`, position: 0, alt: p.name },
        { url: PLACEHOLDER(`${p.name} — back`, "e0dccf"), publicId: `seed/${p.slug}-2`, position: 1, alt: `${p.name} back view` },
      ];

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        designDetails: p.designDetails,
        price: p.price,
        sku: p.sku,
        material: p.material,
        careInstructions: p.careInstructions,
        stockQuantity: p.stockQuantity,
        featured: p.featured,
        newArrival: p.newArrival,
        categoryId: category.id,
        sizes: { create: sizeIds(p.sizes) },
        colors: { create: colorIds(p.colors) },
        images: { create: images },
      },
    });
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Hillvary",
      contactEmail: "hello@hillvary.com",
      contactPhone: "+250 700 000 000",
      whatsappUrl: "https://wa.me/250700000000",
      instagramUrl: "https://instagram.com/hillvary",
      tiktokUrl: "https://tiktok.com/@hillvary",
      storeAddress: "Kigali, Rwanda",
      aboutText:
        "A Christian clothing ministry dedicated to empowering Believers through wearable truth.",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
