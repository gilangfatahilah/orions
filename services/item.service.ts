"use server"
import prisma from '@/lib/db';
import { Item } from '@prisma/client';
import { getCategoryById } from './category.service';


export const createItem = async (data: { name: string, categoryId: string, price: number, image?: string }, user: string): Promise<Item | null> => {
  return await prisma.item.create({
    data: {
      ...data,
      stock: {
        create: {
          quantity: 0,
          prevQuantity: 0,
        }
      },
      history: {
        create: [
          {
            field: 'New Item',
            name: data.name,
            table: 'Item',
            oldValue: '-',
            newValue: data.name,
            modifiedBy: user,
          },
          {
            field: 'Stock',
            name: 'quantity',
            table: 'stock',
            oldValue: '0',
            newValue: '0',
            modifiedBy: user,
          }
        ]
      }
    },
  });
};

export const createSeveralItem = async (
  data: { name: string; price: number; category: string }[],
  user: string
) => {
  const categories = await prisma.category.findMany({
    where: {
      name: { in: data.map((d) => d.category) },
    },
  });

  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  for (const item of data) {
    if (!categoryMap.has(item.category)) {
      throw new Error(`Category ${item.category} does not exist!`);
    }
  }

  const itemsToCreate = data.map((item) => ({
    name: item.name,
    categoryId: categoryMap.get(item.category)!,
    price: item.price,
  }));

  const createdItems = await prisma.item.createMany({
    data: itemsToCreate,
  });

  await prisma.history.createMany({
    data: data.map((d) => ({
      field: 'New Item',
      name: d.name,
      table: 'Item',
      oldValue: '-',
      newValue: d.name,
      modifiedBy: user,
    })),
  });

  return createdItems;
};

export const getItems = async () => {
  return await prisma.item.findMany({
    include: {
      stock: true,
    }
  })
}

export const getItemById = async (id: string): Promise<Item | null> => {
  return await prisma.item.findUnique({
    where: { id },
  })
}

export const updateItem = async (id: string, data: Partial<Item>, user: string): Promise<Item | null> => {
  const currentItem = await prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        }
      }
    }
  })

  if (!currentItem) {
    throw new Error('Item not found');
  }

  const changes: Array<{ field: string, oldValue: string | number | null, newValue: string | number | null }> = []

  if (data.name && data.name !== currentItem.name) {
    changes.push({ field: 'Name', oldValue: currentItem.name, newValue: data.name });
  }
  if (data.categoryId && data.categoryId !== currentItem.categoryId) {
    const category = await getCategoryById(data.categoryId);

    changes.push({ field: 'Category', oldValue: currentItem.category?.name ?? '-', newValue: category?.name ?? '' });
  }
  if (data.price !== undefined && data.price !== currentItem.price) {
    changes.push({ field: 'Price', oldValue: currentItem.price, newValue: data.price });
  }
  if (data.image && data.image !== currentItem.image) {
    changes.push({ field: 'Image', oldValue: currentItem.image, newValue: data.image });
  }


  return await prisma.item.update({
    where: { id },
    data: {
      ...data,
      history: {
        create: changes.map((change) => ({
          field: change.field ?? '',
          table: 'Item',
          name: data.name as string,
          oldValue: change.oldValue?.toString() ?? '',
          newValue: change.newValue?.toString() ?? '',
          modifiedBy: user,
        }))
      }
    }
  });
}

export const deleteSeveralItem = async (id: string[], user: string) => {
  const currentItems = await prisma.item.findMany({
    where: {
      id: { in: id }
    },
    select: {
      id: true,
      name: true,
    }
  })

  await prisma.history.createMany({
    data: currentItems.map((currentItem) => ({
      field: 'Delete Item',
      name: currentItem.name,
      table: 'Item',
      oldValue: currentItem.name,
      newValue: '-',
      modifiedBy: user,
    }))
  })

  return await prisma.item.deleteMany({
    where: {
      id: {
        in: id,
      },
    },
  });
}

export const deleteItem = async (id: string, user: string): Promise<Item | null> => {
  const currentItem = await getItemById(id);
  await prisma.history.create({
    data: {
      field: 'Delete Item',
      table: 'Item',
      name: currentItem?.name ?? '-',
      oldValue: currentItem?.name ?? '-',
      newValue: '-',
      modifiedBy: user,
    }
  })

  return await prisma.item.delete({
    where: { id }
  });
}