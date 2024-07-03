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

export const createUser = async (data: { name: string, email: string, role: string, image?: string }, user: string): Promise<User | null> => {
  return await prisma.user.create({
    data: {
      ...data,
      history: {
        create: [
          {
            field: 'New User',
            table: 'User',
            oldValue: '-',
            name: data.name,
            newValue: data.name,
            modifiedBy: user,
          }
        ]
      }
    }
  });
};

export const updateUser = async (id: string, data: Partial<User>, user: string): Promise<User | null> => {
  const currentUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    }
  })

  if (!currentUser) {
    throw new Error('User not found');
  }

  const changes: Array<{ field: string, oldValue: string, newValue: string }> = []

  if (data.name && data.name !== currentUser.name) {
    changes.push({ field: 'Name', oldValue: currentUser.name, newValue: data.name })
  }
  if (data.email && data.email !== currentUser.email) {
    changes.push({ field: 'Email', oldValue: currentUser.email, newValue: data.email })
  }
  if (data.role && data.role !== currentUser.role) {
    changes.push({ field: 'Role', oldValue: currentUser.role, newValue: data.role })
  }
  if (data.image && data.image !== currentUser.image) {
    changes.push({ field: 'Image', oldValue: currentUser.image ?? '-', newValue: data.image })
  }

  return await prisma.user.update({
    where: { id: id },
    data: {
      ...data,
      history:{
        create: changes.map((change) => ({
          field: change.field ?? '',
          table: 'User',
          name: data.name as string,
          oldValue: change.oldValue ?? '-',
          newValue: change.newValue ?? '-',
          modifiedBy: user,
        }))
      }
    },
  })
};

export const deleteUser = async (id: string, user: string): Promise<User | null> => {
  const currentUser = await getUserById(id);

  await prisma.history.create({
    data: {
      field: 'Delete User',
      table: 'User',
      name: currentUser?.name ?? '-',
      oldValue: currentUser?.name ?? '-',
      newValue:  '-',
      modifiedBy: user,
    }
  })

  return await prisma.user.delete({
    where: {
      id: id,
    }
  })
};

export const deleteSeveralUser = async (id: string[], user: string) => {
  const currentUsers =  await prisma.user.findMany({
    where: {
      id: {in: id}
    },
    select: {
      id: true,
      name: true,
    }
  })

  await prisma.history.createMany({
    data: currentUsers.map((currentUser) => ({
      field: 'Delete User',
      name: currentUser.name,
      table: 'User',
      oldValue: currentUser.name,
      newValue: '-',
      modifiedBy: user,
    }))
  })

  return await prisma.user.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  })
};