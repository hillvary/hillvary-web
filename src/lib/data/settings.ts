import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  return (
    settings ?? {
      id: "singleton",
      siteName: "Hillvary",
      contactEmail: null,
      contactPhone: null,
      whatsappUrl: null,
      instagramUrl: null,
      tiktokUrl: null,
      storeAddress: null,
      aboutText: null,
    }
  );
}
