import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { slugify } from '../lib/utils';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PRODUCT_NAMES = [
  'Field Jacket',
  'Canvas Tote',
  'Wool Beanie',
  'Ceramic Mug',
  'Linen Shirt',
  'Leather Belt',
  'Enamel Pin Set',
  'Notebook, Ruled',
  'Brass Bottle Opener',
  'Wax Canvas Backpack',
  'Merino Socks',
  'Cotton Bandana',
  'Travel Candle',
  'Recycled Fleece',
  'Denim Apron',
  'Steel Water Bottle',
  'Cork Coasters',
  'Wool Blanket',
  'Leather Wallet',
  'Canvas Sneakers',
];

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@anchora.dev' },
    update: {},
    create: { name: 'Store Owner', email: 'owner@anchora.dev', role: 'OWNER', passwordHash },
  });

  await prisma.user.upsert({
    where: { email: 'customer@anchora.dev' },
    update: {},
    create: { name: 'Demo Customer', email: 'customer@anchora.dev', role: 'CUSTOMER', passwordHash },
  });

  const store = await prisma.store.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      name: 'Demo Store',
      slug: 'demo-store',
      description: 'A seeded demo storefront for trying out Anchora Commerce.',
      ownerId: owner.id,
    },
  });

  for (const [i, name] of PRODUCT_NAMES.entries()) {
    const slug = slugify(name);
    await prisma.product.upsert({
      where: { storeId_slug: { storeId: store.id, slug } },
      update: {},
      create: {
        storeId: store.id,
        name,
        slug,
        description: `${name} — a demo product seeded for the Anchora Commerce storefront.`,
        priceCents: 1900 + i * 350,
        inventory: 10 + ((i * 7) % 40),
      },
    });
  }

  console.log(`Seeded store "${store.name}" with ${PRODUCT_NAMES.length} products.`);
  console.log('Demo accounts: owner@anchora.dev / customer@anchora.dev — password "password123"');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
