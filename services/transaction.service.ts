"use server"

import prisma from "@/lib/db";
import { Transaction } from "@prisma/client";

interface TransactionParams {
  type: 'ISSUING' | 'RECEIVING';
  supplierId?: string;
  outletId?: string;
  userId?: string;
  user: string;
  items: {
    id: string;
    quantity: number;
  }[];
}

export const createTransaction = async (
  { type, supplierId, outletId, items, userId, user }:
  TransactionParams): Promise<Transaction | null> => {
  
  let totalPrice = 0;

  for (const item of items) {
    const itemData = await prisma.item.findUnique({
      where: {
        id: item.id,
      }
    });

    if (!itemData) {
      throw new Error(`Item with ID ${item.id} not found`)
    }

    totalPrice += itemData.price * item.quantity;
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: type,
      totalPrice: totalPrice,
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
      newValue: totalPrice.toString(),
      modifiedBy: user,
    },
  })

  for (const item of items) {
    const currentStock = await prisma.stock.findUnique({
      where: {
        id: item.id,
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
        id: item.id,
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