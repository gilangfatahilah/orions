"use server"
import prisma from "@/lib/db";
import { History } from "@prisma/client";

export const getHistoryById = async (id: string): Promise<History | null> => {
  return await prisma.history.findUnique({
    where: { id }
  })
};

export const deleteSeveralHistory = async (id: string[]) => {
  return await prisma.history.deleteMany({
    where: {
      id: {
        in: id,
      },
    },
  });
}

export const deleteHistory = async (id: string): Promise<History | null> => {
  return await prisma.history.delete({
    where: { id }
  });
}