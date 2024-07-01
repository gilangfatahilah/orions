"use server"
import prisma from "@/lib/db"
import { User } from '@prisma/client';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email: email },
  })
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id: id },
  })
};

export const createUser = async (data: { name?: string, email: string, role: string, image?: string }): Promise<User | null> => {
  return await prisma.user.create({
    data: data
  });
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  return await prisma.user.update({
    where: { id: id },
    data: data,
  })
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.user.delete({
    where: {
      id: id,
    }
  })
};

export const deleteSeveralUser = async (id: string[]) => {
  return await prisma.user.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  })
};