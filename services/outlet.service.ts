"use server"
import prisma from '@/lib/db';
import { Outlet } from '@prisma/client';

export const createOutlet = async (data: { name: string, address: string, phone: string, email?: string }): Promise<Outlet | null> => {
  return await prisma.outlet.create({
    data: data,
  })
};

export const getOutletById = async (id: string): Promise<Outlet | null> => {
  return await prisma.outlet.findUnique({
    where: { id }
  })
}

export const updateOutlet = async (id: string, data: Partial<Outlet>): Promise<Outlet | null> => {
  return await prisma.outlet.update({
    where: { id },
    data
  });
}

export const deleteSeveralOutlet = async (id: string[]) => {
  return await prisma.outlet.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteOutlet = async (id: string): Promise<Outlet | null> => {
  return await prisma.outlet.delete({
    where: { id }
  });
}