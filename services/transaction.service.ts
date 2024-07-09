"use server"

import prisma from "@/lib/db";
import { Transaction } from "@prisma/client";

export interface TransactionParams {
  type: 'ISSUING' | 'RECEIVING';
  supplierId?: string;
  outletId?: string;
  userId?: string;
  letterCode: string;
  user: string;
  total: number;
  date: Date;
  items: {
    id: string;
    quantity: number;
  }[];
}

export const createTransaction = async (
  { type, supplierId, outletId, date, total, letterCode, items, userId, user }:
  TransactionParams): Promise<Transaction | null> => {

  const transaction = await prisma.transaction.create({
    data: {
      type: type,
      totalPrice: total,
      transactionDate: date,
      letterCode: letterCode,
      userId: userId,
      supplierId: type === 'RECEIVING' ? supplierId : null,
      outletId: type === 'ISSUING' ? outletId : null,
      detail: {
        create: items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity
        })),
      }
    }
  });

  await prisma.history.create({
    data: {
      field: "Transaction",
      name: type,
      table: 'Transaction',
      oldValue: '-',
      newValue: total.toString(),
      modifiedBy: user,
    },
  })

  for (const item of items) {
    const currentStock = await prisma.stock.findUnique({
      where: {
        itemId: item.id,
      },
    })

    if (!currentStock) {
      throw new Error(`Stock for item with ID ${item.id} not found.`);
    }

    const newQuantity = type === 'RECEIVING'
      ? currentStock.quantity + item.quantity
      : currentStock.quantity - item.quantity;

    await prisma.stock.update({
      where: {
        itemId: item.id,
      },
      data: {
        quantity: newQuantity,
        prevQuantity: currentStock.quantity
      }
    });

    const itemData = await prisma.item.findUnique({
      where: {
        id: item.id,
      }
    });

    await prisma.history.create({
      data: {
        field: 'Stock',
        name: itemData ? itemData.name : 'Unknown',
        table: 'Stock',
        oldValue: currentStock.quantity.toString(),
        newValue: newQuantity.toString(),
        modifiedBy: user,
      }
    })
  }

  return transaction;
}