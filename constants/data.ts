import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: string,
  name: string | null,
  email: string,
  role: string,
  image: string | null,
  createdAt: Date,
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
  }
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
    title: 'Kanban (beta)',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban'
  },
];
