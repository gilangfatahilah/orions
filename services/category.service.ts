"use server"
import prisma from '@/lib/db';
import { Category } from '@prisma/client';

export const getCategory = async (): Promise<Category[] | null> => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const createSeveralCategory = async (data: { name: string, code?: string }[], user: string) => {
  await prisma.history.createMany({
    data: data.map((d) => ({
      field: 'New Category',
      name: d.name,
      table: 'Category',
      oldValue: '-',
      newValue: d.name,
      modifiedBy: user,
    }))
  })

  return await prisma.category.createMany({
    data: data,
  })
}

export const createCategory = async (data: { name: string, code?: string }, user: string): Promise<Category | null> => {
  await prisma.history.create({
    data: {
      field: 'New Category',
      name: data.name,
      table: 'Category',
      oldValue: '-',
      newValue: data.name,
      modifiedBy: user,
    }
  })

  return await prisma.category.create({
    data: data,
  })
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return await prisma.category.findUnique({
    where: { id }
  })
}

export const updateCategory = async (id: string, data: Partial<Category>, user: string): Promise<Category | null> => {
  const currentCategory = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
    }
  })

  if (!currentCategory) {
    throw new Error('User not found');
  }

  const changes: Array<{ field: string, oldValue: string, newValue: string }> = []

  if (data.name && data.name !== currentCategory.name) {
    changes.push({ field: 'Name', oldValue: currentCategory.name, newValue: data.name })
  }
  if (data.code && data.code !== currentCategory.code) {
    changes.push({ field: 'Code', oldValue: currentCategory.code ?? '-', newValue: data.code })
  }

  return await prisma.category.update({
    where: { id },
    data: {
      ...data,
      history: {
        create: changes.map((change) => ({
          field: change.field ?? '',
          table: 'Category',
          name: data.name as string,
          oldValue: change.oldValue ?? '-',
          newValue: change.newValue ?? '-',
          modifiedBy: user,
        }))
      }
    }
  });
}

export const deleteSeveralCategory = async (id: string[], user: string) => {
  const currentCategories = await prisma.category.findMany({
    where: { id: { in: id } },
    select: { id: true, name: true }
  });

  await prisma.history.createMany({
    data: currentCategories.map((category) => ({
      field: 'Delete Category',
      name: category.name,
      table: 'Category',
      oldValue: category.name,
      newValue: '-',
      modifiedBy: user,
    }))
  })

  return await prisma.category.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteCategory = async (id: string, user: string): Promise<Category | null> => {
  const category = await getCategoryById(id);
  
  await prisma.history.create({
    data: {
      field: 'Delete Category',
      table: 'Category',
      name: category?.name ?? '-',
      oldValue: category?.name ?? '-',
      newValue:  '-',
      modifiedBy: user,
    }
  })

  return await prisma.category.delete({
    where: { id }
  });
}