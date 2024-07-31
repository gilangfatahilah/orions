"use server"
import prisma from '@/lib/db';
import { Outlet } from '@prisma/client';

export const createSeveralOutlet = async (data: { name: string, phone: string, address: string, email: string | null }[], user: string) => {
  await prisma.history.createMany({
    data: data.map((d) => ({
      field: 'New Outlet',
      name: d.name,
      table: 'Outlet',
      oldValue: '-',
      newValue: d.name,
      modifiedBy: user,
    }))
  })

  return await prisma.outlet.createMany({
    data: data,
  })
}

export const getOutlets = async (): Promise<Outlet[]| null> => {
  return await prisma.outlet.findMany();
}

export const getOutletById = async (id: string): Promise<Outlet | null> => {
  return await prisma.outlet.findUnique({
    where: { id }
  })
}

export const updateOutlet = async (id: string, data: Partial<Outlet>, user: string): Promise<Outlet | null> => {
  const currentOutlet = await prisma.outlet.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true
    }
  });

  if (!currentOutlet) {
    throw new Error('Outlet not found');
  };

  const changes: Array<{ field: string, oldValue: string | number | null, newValue: string | number | null }> = []

  if (data.name && data.name !== currentOutlet.name) {
    changes.push({ field: 'Name', oldValue: currentOutlet.name, newValue: data.name });
  }
  if (data.email && data.email !== currentOutlet.email) {
    changes.push({ field: 'Email', oldValue: currentOutlet.email, newValue: data.email ?? '-' });
  }
  if (data.phone !== undefined && data.phone !== currentOutlet.phone) {
    changes.push({ field: 'Phone', oldValue: currentOutlet.phone, newValue: data.phone });
  }
  if (data.address && data.address !== currentOutlet.address) {
    changes.push({ field: 'Address', oldValue: currentOutlet.address, newValue: data.address });
  }

  return await prisma.outlet.update({
    where: { id },
    data: {
      ...data,
      history: {
        create: changes.map((change) => ({
          field: change.field ?? '',
          table: 'Outlet',
          name: data.name as string,
          oldValue: change.oldValue?.toString() ?? '',
          newValue: change.newValue?.toString() ?? '',
          modifiedBy: user,
        }))
      }
    }
  });
}

export const deleteSeveralOutlet = async (id: string[], user: string) => {
  const currentOutlets = await prisma.outlet.findMany({
    where: { id: { in: id } },
    select: {
      id: true,
      name: true,
    }
  });

  if (!currentOutlets) {
    throw new Error('Outlet not found');
  };

  await prisma.history.createMany({
    data: currentOutlets.map((currentOutlet) => ({
      field: 'Delete Outlet',
      name: currentOutlet.name,
      table: 'Outlet',
      oldValue: currentOutlet.name,
      newValue: '-',
      modifiedBy: user,
    }))
  })

  return await prisma.outlet.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteOutlet = async (id: string, user: string): Promise<Outlet | null> => {
  const currentOutlet = await prisma.outlet.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    }
  });

  if (!currentOutlet) {
    throw new Error('Outlet not found');
  };
  
  await prisma.history.create({
    data: {
      field: 'Delete Outlet',
      table: 'Outlet',
      name: currentOutlet?.name ?? '-',
      oldValue: currentOutlet?.name ?? '-',
      newValue: '-',
      modifiedBy: user,
    }
  });

  return await prisma.outlet.delete({
    where: { id }
  });
}