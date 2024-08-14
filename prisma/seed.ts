import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient()
const parsePassword = async () => {
  return await bcrypt.hash('adminkey', 10);
};

async function main() {
  // Seed Users
  const password = await parsePassword();
  const user1 = await prisma.user.create({
    data: {
      name: 'Edogawa Ranpo',
      email: 'edogawa@stray.com',
      password: password,
      role: 'Admin',
      image: null,
      colorScheme: null,
      joinedAt: new Date(),
    },
  });

  // Seed Categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Electronics',
      code: 'ELEC',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Furniture',
      code: 'FURN',
    },
  });

  // Seed Items
  const item1 = await prisma.item.create({
    data: {
      name: 'Laptop',
      price: 1500000,
      image: null,
      category: {
        connect: { id: category1.id },
      },
      stock: {
        create: {
          quantity: 0,
          prevQuantity: 0,
        },
      },
    },
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'Sofa',
      price: 500000,
      image: null,
      category: {
        connect: { id: category2.id },
      },
      stock: {
        create: {
          quantity: 0,
          prevQuantity: 0,
        },
      },
    },
  });

  // Seed Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Supplier A',
      address: '123 Supplier Street',
      phone: '081234567890',
      email: 'supplierA@example.com',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Supplier B',
      address: '456 Supplier Avenue',
      phone: '081234567891',
      email: 'supplierB@example.com',
    },
  });

  // Seed Outlets
  const outlet1 = await prisma.outlet.create({
    data: {
      name: 'Outlet 1',
      address: '789 Outlet Boulevard',
      phone: '081234567892',
      email: 'outlet1@example.com',
    },
  });

  const outlet2 = await prisma.outlet.create({
    data: {
      name: 'Outlet 2',
      address: '101 Outlet Road',
      phone: '081234567893',
      email: 'outlet2@example.com',
    },
  });

  console.log({ user1, category1, category2, item1, item2, supplier1, supplier2, outlet1, outlet2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
