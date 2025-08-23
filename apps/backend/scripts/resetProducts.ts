// apps/backend/scripts/resetProducts.ts
import prisma from "../src/prisma";

async function main() {
  // Postgres: truncate and restart sequences, cascade to children
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "ProductImage", "Product" RESTART IDENTITY CASCADE;
  `);

  console.log("✅ Products + ProductImages truncated and IDs reset to 1.");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
