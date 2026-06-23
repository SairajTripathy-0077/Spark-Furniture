const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');
  const defaultCategories = [
    'Chairs', 
    'Workstations', 
    'Modular Furniture', 
    'Bed', 
    'Sofa', 
    'Dinning Sets', 
    'Mattress'
  ];

  for (const catName of defaultCategories) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName }
    });
  }
  console.log('Categories seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
