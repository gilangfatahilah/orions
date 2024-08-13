"use server"

import prisma from "@/lib/db";
import { Transaction } from "@prisma/client";
import { getSupplierById } from "./supplier.service";
import { getOutletById } from "./outlet.service";

export interface TransactionParams {
  type: 'ISSUING' | 'RECEIVING';
  supplierId?: string;
  outletId?: string;
  userId: string;
  letterCode: string;
  user: string;
  total: number;
  date: Date;
  items: {
    id: string;
    quantity: number;
    itemDetail?: string;
  }[];
}

export interface TransactionReportParams {
  type: 'ISSUING' | 'RECEIVING';
  totalPrice: number;
  transactionDate: Date;
  letterCode: string;
  user: string;
  supplier: string | null;
  outlet: string | null;
  detail: string;
}

export const createTransaction = async (
  { type, supplierId, outletId, date, total, letterCode, items, userId, user }:
    TransactionParams): Promise<Transaction | null> => {

  const getItemSource = supplierId ? await getSupplierById(supplierId!) : getOutletById(outletId!);

  if (!getItemSource) {
    throw new Error('Failed to get data supplier / outlet');
  }

  const parsedItemSource = JSON.stringify(getItemSource);

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
    });

    item.itemDetail = itemData ? JSON.stringify(itemData) : '';
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: type,
      totalPrice: total,
      transactionDate: date,
      letterCode: letterCode,
      userId: userId,
      supplierId: type === 'RECEIVING' ? supplierId : null,
      outletId: type === 'ISSUING' ? outletId : null,
      userName: user,
      supplierDetail: type === 'RECEIVING' ? parsedItemSource : null,
      outletDetail: type === 'ISSUING' ? parsedItemSource : null,
      detail: {
        create: items.map((item) => ({
          itemId: item.id,
          itemDetail: item.itemDetail as string,
          quantity: item.quantity
        })),
      }
    }
  });

  return transaction;
}

export const getTransactionDetail = async (id: string) => {
  return await prisma.transaction.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      totalPrice: true,
      letterCode: true,
      transactionDate: true,
      supplier: {
        select: { id: true, name: true, address: true, phone: true }
      },
      outlet: {
        select: { id: true, name: true, address: true, phone: true }
      },
      user: {
        select: { id: true, name: true }
      },
      detail: {
        select: { id: true, quantity: true, item: { select: { id: true, image: true, name: true, price: true } } }
      }
    }
  });
};
