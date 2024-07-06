"use server"
import prisma from '@/lib/db';
import { Stock } from '@prisma/client';

export const getStockById = async (id: string): Promise<Stock | null> => {
  return await prisma.stock.findUnique({
    where: { id }
  })
}

export const deleteSeveralStock = async (id: string[]) => {
  return await prisma.stock.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteStock = async (id: string): Promise<Stock | null> => {
  return await prisma.stock.delete({
    where: { id }
  });
}