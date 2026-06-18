const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all products from the database...');
  const deleteResult = await prisma.product.deleteMany({});
  console.log(`Deleted ${deleteResult.count} products.`);
  console.log('Database cleared successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
