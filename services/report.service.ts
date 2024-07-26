'use server';

import prisma from "@/lib/db";

interface StockSummary {
  itemName: string;
  itemCode: string;
  itemPrice: number;
  stockIn: number;
  stockOut: number;
  firstMonthUnit: number;
  finalMonthUnit: number;
  itemPriceTotal: number;
  month: string;
  year: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getStockSummary = async (month?: string, year?: number): Promise<StockSummary[]> => {
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

    if (sortedTransactions.length === 0) {
      return [];
    }

    const firstTransactionDate = sortedTransactions[0].transaction.transactionDate;
    const lastTransactionDate = new Date();

    const monthlySummary: Record<string, StockSummary> = {};

    let currentStock = 0;

    for (let d = new Date(firstTransactionDate.getFullYear(), firstTransactionDate.getMonth(), 1); d <= lastTransactionDate; d.setMonth(d.getMonth() + 1)) {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const key = `${item.id}-${year}-${month}`;

      monthlySummary[key] = {
        itemName: item.name,
        itemCode: item.id,
        itemPrice: item.price,
        firstMonthUnit: currentStock,
        stockIn: 0,
        stockOut: 0,
        finalMonthUnit: currentStock,
        itemPriceTotal: item.price * currentStock,
        month: monthNames[month - 1],
        year,
      };
    }

    sortedTransactions.forEach(td => {
      const month = td.transaction.transactionDate.getMonth() + 1;
      const year = td.transaction.transactionDate.getFullYear();
      const key = `${item.id}-${year}-${month}`;

      if (td.transaction.type === 'RECEIVING') {
        monthlySummary[key].stockIn += td.quantity;
      } else if (td.transaction.type === 'ISSUING') {
        monthlySummary[key].stockOut += td.quantity;
      }
    });

    let previousKey: string | null = null;
    for (let d = new Date(firstTransactionDate.getFullYear(), firstTransactionDate.getMonth(), 1); d <= lastTransactionDate; d.setMonth(d.getMonth() + 1)) {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const key = `${item.id}-${year}-${month}`;

      if (previousKey) {
        monthlySummary[key].firstMonthUnit = monthlySummary[previousKey].finalMonthUnit;
      }

      monthlySummary[key].finalMonthUnit = monthlySummary[key].firstMonthUnit + monthlySummary[key].stockIn - monthlySummary[key].stockOut;
      monthlySummary[key].itemPriceTotal = monthlySummary[key].itemPrice * monthlySummary[key].finalMonthUnit;

      previousKey = key;
    }

    return Object.values(monthlySummary);
  });

  if (month && year) {
    const filteredSummaries = stockSummary.filter((item) => item.month === month && item.year === year);
    return filteredSummaries;
  }

  return stockSummary;
};
