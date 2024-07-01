"use server"
import prisma from '@/lib/db';
import { Category } from '@prisma/client';

export const createCategory = async (data: { name: string, code?: string }): Promise<Category | null> => {
  return await prisma.category.create({
    data: data,
  })
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return await prisma.category.findUnique({
    where: { id }
  })
}

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category | null> => {
  return await prisma.category.update({
    where: { id },
    data
  });
}

export const deleteSeveralCategory = async (id: string[]) => {
  return await prisma.category.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteCategory = async (id: string): Promise<Category | null> => {
  return await prisma.category.delete({
    where: { id }
  });
}