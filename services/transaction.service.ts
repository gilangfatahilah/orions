"use server"

import prisma from "@/lib/db";
import { Transaction } from "@prisma/client";

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
  }[];
}

interface StockSummary {
  itemName: string;
  itemCode: string;
  itemPrice: number;
  stockIn: number;
  stockOut: number;
  firstMonthUnit: number;
  finalMonthUnit: number;
  itemPriceTotal: number;
  month: number;
  year: number;
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
}

export const getStockSummary = async (): Promise<StockSummary[]> => {
  const items = await prisma.item.findMany({
    include: {
      transactions: {
        include: {
          transaction: true,
        },
      },
    },
  });

  const stockSummary: StockSummary[] = items.flatMap(item => {
    const sortedTransactions = item.transactions.sort(
      (a, b) => a.transaction.transactionDate.getTime() - b.transaction.transactionDate.getTime()
    );

    let currentStock = 0;
    const monthlySummary = sortedTransactions.reduce<Record<string, StockSummary>>((acc, td) => {
      const month = td.transaction.transactionDate.getMonth() + 1; // getMonth() returns 0-11
      const year = td.transaction.transactionDate.getFullYear();

      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = {
          itemName: item.name,
          itemCode: item.id,
          itemPrice: item.price,
          firstMonthUnit: currentStock,
          stockIn: 0,
          stockOut: 0,
          finalMonthUnit: 0,
          itemPriceTotal: 0,
          month,
          year,
        };
      }

      if (td.transaction.type === 'RECEIVING') {
        acc[key].stockIn += td.quantity;
        currentStock += td.quantity;
      } else if (td.transaction.type === 'ISSUING') {
        acc[key].stockOut += td.quantity;
        currentStock -= td.quantity;
      }

      acc[key].finalMonthUnit = currentStock;
      acc[key].itemPriceTotal = acc[key].itemPrice * acc[key].finalMonthUnit;

      return acc;
    }, {});

    return Object.values(monthlySummary);
  });

  return stockSummary;
};
