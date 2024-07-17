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

interface MonthlyItemCount {
  month: string;
  year: number;
  itemCount: number;
}

interface TotalItemSummary {
  label: string;
  value: number;
  fill : string;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    const firstTransactionDate = sortedTransactions.length > 0
      ? sortedTransactions[0].transaction.transactionDate
      : new Date();
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

  return stockSummary;
};

export const getTotalItemsByMonth = async (): Promise<MonthlyItemCount[]> => {
  // Retrieve the full stock summary data
  const stockSummaries = await getStockSummary();

  // Get the current date and calculate the date 12 months ago
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Filter summaries to include only the last 12 months
  const filteredSummaries = stockSummaries.filter(summary => {
    const summaryDate = new Date(summary.year, monthNames.indexOf(summary.month));
    return summaryDate >= twelveMonthsAgo;
  });

  // Aggregate item counts by month and year
  const itemCountByMonth: Record<string, MonthlyItemCount> = filteredSummaries.reduce((acc, summary) => {
    const key = `${summary.year}-${summary.month}`;
    if (!acc[key]) {
      acc[key] = {
        month: summary.month,
        year: summary.year,
        itemCount: 0,
      };
    }

    acc[key].itemCount += summary.finalMonthUnit;
    return acc;
  }, {} as Record<string, MonthlyItemCount>);

  // Convert the aggregated data to an array and sort by year and month
  const sortedItemCountByMonth = Object.values(itemCountByMonth).sort((a, b) => {
    if (a.year === b.year) {
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    }
    return a.year - b.year;
  });

  return sortedItemCountByMonth;
};


export const getTotalItemsSummary = async (): Promise<TotalItemSummary[]> => {
  const dataItem = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      stock: {
        select: {
          quantity: true,
        }
      }
    }
  });

  const sortedItems = dataItem
    .map((item) => ({
      label: item.name,
      value: item.stock?.quantity ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const top5Items = sortedItems.slice(0, 5);
  const othersQuantity = sortedItems.slice(5).reduce((sum, item) => sum + item.value, 0);

  const colors = ['#2463EB', '#60A8FB', '#3B86F7', '#91C6FE', '#BDDCFE', '#5AB2FF'];

  return [
    ...top5Items.map((item, index) => ({ ...item, fill: colors[index] })),
    { label: 'others', value: othersQuantity, fill: colors[5] },
  ];
}