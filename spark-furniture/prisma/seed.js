const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Velvet Amber Lounge Chair',
    price: 450,
    originalPrice: 520,
    rating: 4.8,
    reviewsCount: 124,
    category: 'Chairs',
    description: 'Chic mid-century lounge chair with tapered walnut legs and ergonomic wrap-around cushioning. Upholstered in premium, spill-resistant amber velvet that adds warmth to any living space.',
    colors: JSON.stringify([
      { name: 'Amber Velvet', hex: '#d97706' },
      { name: 'Forest Green', hex: '#14532d' },
      { name: 'Classic Slate', hex: '#475569' },
    ]),
    imageType: 'chair',
    badge: 'Sale'
  },
  {
    name: 'Monolith Oak Dining Table',
    price: 1250,
    rating: 4.9,
    reviewsCount: 86,
    category: 'Tables',
    description: 'Solid oak dining table featuring an architectural pedestal base and a clean, live-edge finish. Built to comfortably seat up to 8 guests and endure generations of family meals.',
    colors: JSON.stringify([
      { name: 'Natural Oak', hex: '#d2b48c' },
      { name: 'Smoked Oak', hex: '#634832' },
      { name: 'Walnut Stain', hex: '#4a3728' },
    ]),
    imageType: 'table',
    badge: 'New'
  },
  {
    name: 'Bouclé Curve Sofa',
    price: 2100,
    originalPrice: 2450,
    rating: 4.7,
    reviewsCount: 43,
    category: 'Sofas',
    description: 'Organic curved three-seater sofa upholstered in textured cream bouclé fabric. The sculptural silhouette provides an elegant statement piece with deep, plush seating comfort.',
    colors: JSON.stringify([
      { name: 'Cream Bouclé', hex: '#f4f1ea' },
      { name: 'Oatmeal Tweed', hex: '#d5cdbe' },
      { name: 'Charcoal Linen', hex: '#2d2d2d' },
    ]),
    imageType: 'sofa',
    badge: 'Sale'
  },
  {
    name: 'Holo Brass Pendant Light',
    price: 280,
    rating: 4.6,
    reviewsCount: 78,
    category: 'Lighting',
    description: 'Sleek brushed brass ceiling fixture with dual hand-blown warm frosted glass globes. Creates a dramatic soft light ideal for hanging over kitchen islands or dining areas.',
    colors: JSON.stringify([
      { name: 'Brushed Brass', hex: '#e2b13c' },
      { name: 'Matte Black', hex: '#1c1c1c' },
      { name: 'Polished Chrome', hex: '#c0c0c0' },
    ]),
    imageType: 'lamp',
    badge: null
  },
  {
    name: 'Walnut Slatted Credenza',
    price: 1600,
    rating: 4.9,
    reviewsCount: 92,
    category: 'Storage',
    description: 'Mid-century sideboard featuring walnut veneer, sliding slatted doors, and plenty of adjustable internal shelving. Serves perfectly as an elegant media console or entryway credenza.',
    colors: JSON.stringify([
      { name: 'Rich Walnut', hex: '#4e3629' },
      { name: 'Natural Ash', hex: '#e9e4db' },
    ]),
    imageType: 'storage',
    badge: 'New'
  },
  {
    name: 'Elysian Arc Armchair',
    price: 580,
    rating: 4.8,
    reviewsCount: 65,
    category: 'Chairs',
    description: 'Sculptural accent armchair featuring cream performance fabric and a curved wooden back panel. Perfect for creating a cozy, contemporary reading nook in bedrooms or study rooms.',
    colors: JSON.stringify([
      { name: 'Pebble White', hex: '#f2ece4' },
      { name: 'Warm Taupe', hex: '#bda895' },
      { name: 'Terracotta', hex: '#c2593f' },
    ]),
    imageType: 'chair',
    badge: 'Limited'
  },
  {
    name: 'Travertine Pillar Side Table',
    price: 390,
    rating: 4.5,
    reviewsCount: 38,
    category: 'Tables',
    description: 'Honed travertine stone side table boasting a block geometric pillar structure. Adds an architectural, minimalist element to your living setup, showcasing organic textures of genuine stone.',
    colors: JSON.stringify([
      { name: 'Travertine', hex: '#eae3d2' },
      { name: 'Carrara Marble', hex: '#f0f3f4' },
    ]),
    imageType: 'table',
    badge: null
  },
  {
    name: 'Minimalist Linear Desk Lamp',
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviewsCount: 29,
    category: 'Lighting',
    description: 'Sleek matte aluminum desk lamp equipped with premium high-CRI linear LEDs. Features intuitive touch-dimming controls, rotating arms, and USB charging built right into the base.',
    colors: JSON.stringify([
      { name: 'Matte Black', hex: '#1c1c1c' },
      { name: 'Anodized Silver', hex: '#cfd2d6' },
    ]),
    imageType: 'lamp',
    badge: 'Sale'
  }
];

async function main() {
  console.log('Clearing existing products...');
  await prisma.product.deleteMany({});
  
  console.log('Seeding products...');
  for (const product of initialProducts) {
    await prisma.product.create({
      data: product
    });
  }
  
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
