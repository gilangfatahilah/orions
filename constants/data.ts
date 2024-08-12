import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export type Employee = {
  id: string,
  name: string,
  email: string,
  role: string,
  image: string | null,
  joinedAt: Date | null,
};

export type Category = {
  id: string,
  name: string,
  code: string | null,
}

export type Supplier = {
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string | null,
}

export type Outlet = {
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string | null,
}

export type Item = {
  id: string,
  name: string,
  price: number,
  image: string | null,
  category: {
    name: string,
  } | null,
}

export type Stock = {
  id: string,
  item: {
    name: string,
    image: string | null,
  }
  prevQuantity: number,
  quantity: number,
}

export type History = {
  id: string,
  field: string,
  name: string,
  oldValue: string,
  newValue: string,
  modifiedBy: string,
  createdAt: Date,
}

export type Transaction = {
  id: string,
  name: string,
  image?: string,
  quantity: number,
  pricePerItem: number,
  priceFinal: number,
}

export type TransactionHistory = {
  id: string,
  type: 'ISSUING' | 'RECEIVING',
  transactionDate: Date,
  letterCode: string,
  totalPrice: number,
  supplier: {
    id: string,
    name: string,
  } | null,
  outlet: {
    id: string,
    name: string,
  } | null,
  user: {
    id: string,
    name: string,
  } | null
}

export type TransactionDetail = {
  id: string,
  type: 'ISSUING' | 'RECEIVING',
  transactionDate: Date,
  letterCode: string,
  totalPrice: number,
  userName: string,
  supplierDetail: string | null,
  outletDetail: string | null,
  detail: {
    id: string,
    quantity: number,
    itemDetail: string,
  }[],
}

export type Summary = {
  finalMonthUnit: number,
  firstMonthUnit: number,
  itemCode: string,
  itemName: string,
  itemPrice: number,
  itemPriceTotal: number,
  month: string,
  stockIn: number,
  stockOut: number,
  year: number,
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'User',
    href: '/dashboard/user',
    icon: 'user',
    label: 'user'
  },
  {
    title: 'Category',
    href: '/dashboard/category',
    icon: 'category',
    label: 'category'
  },
  {
    title: 'Supplier',
    href: '/dashboard/supplier',
    icon: 'supplier',
    label: 'supplier'
  },
  {
    title: 'Outlet',
    href: '/dashboard/outlet',
    icon: 'outlet',
    label: 'outlet'
  },
  {
    title: 'Item',
    href: '/dashboard/item',
    icon: 'item',
    label: 'item'
  },
  {
    title: 'Stock',
    href: '/dashboard/stock',
    icon: 'stock',
    label: 'stock'
  },
  {
    title: 'Transaction',
    href: '/dashboard/transaction',
    icon: 'transaction',
    label: 'transaction'
  },
  {
    title: 'Report',
    href: '/dashboard/report',
    icon: 'report',
    label: 'report'
  },
  {
    title: 'Setting',
    href: '/dashboard/setting',
    icon: 'settings',
    label: 'setting'
  },
];
