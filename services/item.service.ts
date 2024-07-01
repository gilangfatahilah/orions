"use server"
import prisma from '@/lib/db';
import { Item } from '@prisma/client';

export const createItem = async (data: { name: string, categoryId: string, price: number, image?: string }): Promise<Item | null> => {
  return await prisma.item.create({
    data: data,
  })
};

export const getItemById = async (id: string): Promise<Item | null> => {
  return await prisma.item.findUnique({
    where: { id }
  })
}

export const updateItem = async (id: string, data: Partial<Item>): Promise<Item | null> => {
  return await prisma.item.update({
    where: { id },
    data
  });
}

export const deleteSeveralItem = async (id: string[]) => {
  return await prisma.item.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteItem = async (id: string): Promise<Item | null> => {
  return await prisma.item.delete({
    where: { id }
  });
}