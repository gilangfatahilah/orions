'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 5000) + 1000
  }
];

export function Overview() {
  const contentStyle = {
    width: '150%',
    backgroundColor: '#000000',
    padding: 'none',
    border: '2px solid #27272A',
    borderRadius: '6px',
  }

  const labelStyle = {
    fontSize: '14px',
    padding: '6px',
    color: '#fff',
    fontWeight: '700',
    borderBottom: '2px solid #27272A'
  }

  const itemStyle = {
    fontSize: '12px',
    padding: '6px',
    color: '#fff',
    fontWeight: '500',
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />

        <Tooltip animationEasing='ease-out' animationDuration={400} itemStyle={itemStyle} contentStyle={contentStyle} labelStyle={labelStyle} />
        <Bar dataKey="total" fill="#1D24CA" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
