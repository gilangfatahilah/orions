/* eslint-disable no-console */
'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Overview } from '@/components/overview';
import { TotalStocks } from '@/components/totalStocks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CardSummary, MonthlyItemCount, TotalItemSummary } from '@/services/dashboard.service';
import { generatePDF } from '@/lib/fileExport';
import { formatDate } from '@/lib/formatter';
import { Icons } from './icons';

interface DashboardProps {
  monthlyItemSummary: MonthlyItemCount[];
  totalItemSummary: TotalItemSummary[];
  cardSummary: CardSummary;
  sessionUser: string;
}

const DashboardOverview: React.FC<DashboardProps> = ({ monthlyItemSummary, totalItemSummary, cardSummary, sessionUser }) => {
  const overviewRef = React.useRef(null);
  const previousMonthStock = monthlyItemSummary[monthlyItemSummary.length - 2]?.itemCount ?? 0;

  const handleDownload = () => {
    if (overviewRef.current) {
      generatePDF(overviewRef.current, `Overview.pdf`, `Stock Overview ${formatDate(new Date())}`);
    }
  }

  const getFirstWord = (str: string): string => {
    const words = str.split(' ');
    return words.length > 0 ? words[0] : '';
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Hi, Welcome back {getFirstWord(sessionUser) ?? ''} 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          <Button onClick={handleDownload}>Download</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4" ref={overviewRef}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Price Value
                </CardTitle>
                <Icons.billing className='w-4 h-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardSummary.totalPrice}</div>
                <p className="text-xs text-muted-foreground">
                  {cardSummary.priceDescription}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Supplier
                </CardTitle>
                <Icons.supplier className='w-4 h-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardSummary.totalSupplier}</div>
                <p className="text-xs text-muted-foreground">
                  {cardSummary.supplierDescription}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outlet</CardTitle>
                <Icons.outlet className='w-4 h-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardSummary.totalOutlet}</div>
                <p className="text-xs text-muted-foreground">
                  {cardSummary.outletDescription}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total User
                </CardTitle>
                <Icons.users className='w-4 h-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cardSummary.totalUser}</div>
                <p className="text-xs text-muted-foreground">
                  {cardSummary.userDescription}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 max-h-[500px]">
              <CardHeader>
                <CardTitle>Monthly Stock Summary
                  {` ${monthlyItemSummary[0]?.month ?? ''} ${monthlyItemSummary[0]?.year ?? ''} - Now`}
                </CardTitle>
                <CardDescription>Summary of items stock at the end of each month.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={monthlyItemSummary} />
              </CardContent>
            </Card>
            <div className='col-span-4 md:col-span-3'>
              <TotalStocks data={totalItemSummary} previousMonthStock={previousMonthStock} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardOverview