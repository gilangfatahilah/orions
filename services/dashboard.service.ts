'use server';

import prisma from "@/lib/db";

export interface MonthlyItemCount {
  month: string;
  year: number;
  itemCount: number;
}

export interface TotalItemSummary {
  label: string;
  value: number;
  fill: string;
}

export interface CardSummary {
  totalPrice: string;
  priceDescription: string;
  totalUser: number;
  userDescription: string;
  totalSupplier: number;
  supplierDescription: string;
  totalOutlet: number;
  outletDescription: string;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getStockSummary = async (month?: string, year?: number) => {
  const items = await prisma.item.findMany({
    include: {
      transactions: {
        include: {
          transaction: true,
        },
      },
    },
  });

  const data =  items.map(item => {
    const sortedTransactions = item.transactions.sort(
      (a, b) => a.transaction.transactionDate.getTime() - b.transaction.transactionDate.getTime()
    );

    const monthlySummary: Record<string, any> = {};
    let currentStock = 0;

    sortedTransactions.forEach(td => {
      const month = td.transaction.transactionDate.getMonth() + 1;
      const year = td.transaction.transactionDate.getFullYear();
      const key = `${item.id}-${year}-${month}`;

      if (!monthlySummary[key]) {
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

      if (td.transaction.type === 'RECEIVING') {
        monthlySummary[key].stockIn += td.quantity;
      } else if (td.transaction.type === 'ISSUING') {
        monthlySummary[key].stockOut += td.quantity;
      }

      currentStock += td.transaction.type === 'RECEIVING' ? td.quantity : -td.quantity;
      monthlySummary[key].finalMonthUnit = currentStock;
      monthlySummary[key].itemPriceTotal = monthlySummary[key].itemPrice * currentStock;
    });
    return Object.values(monthlySummary);
  }).flat();

  if (month && year) {
    return data.filter((d) => d.year === year && d.month === month);
  }

  return data;
};

export const getTotalItemsByMonth = async () => {
  const stockSummaries = await getStockSummary();
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const itemCountByMonth: Record<string, any> = {};

  stockSummaries.forEach(summary => {
    const summaryDate = new Date(summary.year, monthNames.indexOf(summary.month));
    if (summaryDate >= twelveMonthsAgo) {
      const key = `${summary.year}-${summary.month}`;

      if (!itemCountByMonth[key]) {
        itemCountByMonth[key] = {
          month: summary.month,
          year: summary.year,
          itemCount: 0,
        };
      }

      // Add the finalMonthUnit of the current summary to the total count for that month
      itemCountByMonth[key].itemCount += summary.finalMonthUnit;
    }
  });

  // Sort the results by year and month
  return Object.values(itemCountByMonth).sort((a, b) => {
    if (a.year === b.year) {
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    }
    return a.year - b.year;
  });
};


export const getTotalItemsSummary = async () => {
  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      stock: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const sortedItems = items
    .map((item) => ({
      label: item.name,
      value: item.stock?.quantity ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const top5Items = sortedItems.slice(0, 5);
  const othersQuantity = sortedItems.slice(5).reduce((sum, item) => sum + item.value, 0);

  const colors = ['#E23670', '#E88C30', '#AF57DB', '#2EB88A', '#2662D9', '#60432F'];

  return [
    ...top5Items.map((item, index) => ({ ...item, fill: colors[index] })),
    { label: 'others', value: othersQuantity, fill: colors[5] },
  ];
};

export const getCardSummary = async () => {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return 'Rp ' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
      return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
    }
    return 'Rp ' + amount.toLocaleString();
  };

  const aggregate = (current: number, previous: number) => {
    const diff = current - previous;
    return diff >= 0 ? `+${diff} from last month` : `${diff} from last month`;
  };

  const priceAggregate = (current: number, previous: number) => {
    const diff =(((current - previous) / previous) * 100).toFixed(2) + '%';

    if (diff.startsWith('-') || diff.startsWith('0')){
      return `${diff} from last month`;
    }else {
      return `+${diff} from last month`
    }
  }

  const dataItem = await prisma.item.findMany({
    select: {
      id: true,
      price: true,
      stock: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const [totalUser, totalSupplier, totalOutlet] = await Promise.all([
    prisma.user.count(),
    prisma.supplier.count(),
    prisma.outlet.count(),
  ]);

  const now = new Date();
  const year = now.getFullYear();
  const lastMonth = monthNames[now.getMonth() - 1];

  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(firstDayOfCurrentMonth);
  firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
  const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth);
  lastDayOfLastMonth.setDate(lastDayOfLastMonth.getDate() - 1);

  const [userLastMonth, supplierLastMonth, outletLastMonth, lastMonthData] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfCurrentMonth,
        },
      },
    }),
    prisma.supplier.count({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfCurrentMonth,
        },
      },
    }),
    prisma.outlet.count({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfCurrentMonth,
        },
      },
    }),
    getStockSummary(lastMonth, year),
  ]);

  const lastMonthTotalPrice = lastMonthData.reduce((sum, data) => sum + data.itemPriceTotal, 0);
  const currentPrice = dataItem.reduce((sum, item) => sum + (item.price * (item.stock?.quantity || 0)), 0);


  const priceDescription =   priceAggregate(currentPrice, lastMonthTotalPrice);
  const supplierDescription = aggregate(totalSupplier, supplierLastMonth);
  const outletDescription = aggregate(totalOutlet, outletLastMonth);
  const userDescription = aggregate(totalUser, userLastMonth);

  return {
    totalPrice: formatAmount(currentPrice),
    priceDescription,
    totalSupplier,
    supplierDescription,
    totalOutlet,
    outletDescription,
    totalUser,
    userDescription,
  };
};

export const getDashboardSummary = async () => {
  const [monthlyItemSummary, totalItemSummary, cardSummary] = await Promise.all([
    getTotalItemsByMonth(),
    getTotalItemsSummary(),
    getCardSummary(),
  ]);

  return {
    monthlyItemSummary,
    totalItemSummary,
    cardSummary,
  };
};
