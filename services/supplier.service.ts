"use server"
import prisma from '@/lib/db';
import { Supplier } from '@prisma/client';

export const createSupplier = async (data: { name: string, address: string, phone: string, email?: string }): Promise<Supplier | null> => {
  return await prisma.supplier.create({
    data: data,
  })
};

export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  return await prisma.supplier.findUnique({
    where: { id }
  })
}

export const updateSupplier = async (id: string, data: Partial<Supplier>): Promise<Supplier | null> => {
  return await prisma.supplier.update({
    where: { id },
    data
  });
}

export const deleteSeveralSupplier = async (id: string[]) => {
  return await prisma.supplier.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteSupplier = async (id: string): Promise<Supplier | null> => {
  return await prisma.supplier.delete({
    where: { id }
  });
}