"use server"
import prisma from '@/lib/db';
import { Supplier } from '@prisma/client';

export const createSupplier = async (data: { name: string, address: string, phone: string, email?: string }, user: string): Promise<Supplier | null> => {
  return await prisma.supplier.create({
    data: {
      ...data,
      history: {
        create: {
          field: 'New Supplier',
          name: data.name,
          table: 'Supplier',
          oldValue: '-',
          newValue: data.name,
          modifiedBy: user,
        }
      }
    },
  })
};

export const getSuppliers = async (): Promise<Supplier[] | null> => {
  return await prisma.supplier.findMany();
}

export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  return await prisma.supplier.findUnique({
    where: { id }
  })
}

export const updateSupplier = async (id: string, data: Partial<Supplier>, user: string): Promise<Supplier | null> => {
  const currentSupplier = await prisma.supplier.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true
    }
  });

  if (!currentSupplier) {
    throw new Error('Supplier not found');
  };

  const changes: Array<{ field: string, oldValue: string | number | null, newValue: string | number | null }> = []

  if (data.name && data.name !== currentSupplier.name) {
    changes.push({ field: 'Name', oldValue: currentSupplier.name, newValue: data.name });
  }
  if (data.email && data.email !== currentSupplier.email) {
    changes.push({ field: 'Email', oldValue: currentSupplier.email, newValue: data.email ?? '-' });
  }
  if (data.phone !== undefined && data.phone !== currentSupplier.phone) {
    changes.push({ field: 'Phone', oldValue: currentSupplier.phone, newValue: data.phone });
  }
  if (data.address && data.address !== currentSupplier.address) {
    changes.push({ field: 'Address', oldValue: currentSupplier.address, newValue: data.address });
  }

  return await prisma.supplier.update({
    where: { id },
    data: {
      ...data,
      history: {
        create: changes.map((change) => ({
          field: change.field ?? '',
          table: 'Supplier',
          name: data.name as string,
          oldValue: change.oldValue?.toString() ?? '',
          newValue: change.newValue?.toString() ?? '',
          modifiedBy: user,
        }))
      }
    }
  });
}

export const deleteSeveralSupplier = async (id: string[], user: string) => {
  const currentSuppliers = await prisma.supplier.findMany({
    where: { id: { in: id } },
    select: {
      id: true,
      name: true,
    }
  });

  if (!currentSuppliers) {
    throw new Error('Supplier not found');
  };

  await prisma.history.createMany({
    data: currentSuppliers.map((currentSupplier) => ({
      field: 'Delete Supplier',
      name: currentSupplier.name,
      table: 'Supplier',
      oldValue: currentSupplier.name,
      newValue: '-',
      modifiedBy: user,
    }))
  })

  return await prisma.supplier.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteSupplier = async (id: string, user: string): Promise<Supplier | null> => {
  const currentSupplier = await prisma.supplier.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    }
  });

  if (!currentSupplier) {
    throw new Error('Supplier not found');
  };
  
  await prisma.history.create({
    data: {
      field: 'Delete Supplier',
      table: 'Supplier',
      name: currentSupplier?.name ?? '-',
      oldValue: currentSupplier?.name ?? '-',
      newValue: '-',
      modifiedBy: user,
    }
  });

  return await prisma.supplier.delete({
    where: { id }
  });
}