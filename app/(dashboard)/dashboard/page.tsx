import React from 'react';
import { auth } from '@/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDashboardSummary } from '@/services/dashboard.service';
import DashboardOverview from '@/components/dashboard-overview';

export default async function page() {
  const session = await auth();

  const {monthlyItemSummary, totalItemSummary, cardSummary} = await getDashboardSummary();
  
  return (
    <ScrollArea className="h-full">
      <DashboardOverview
        monthlyItemSummary={monthlyItemSummary}
        totalItemSummary={totalItemSummary}
        cardSummary={cardSummary}
        sessionUser={session?.user.name as string}
      />
    </ScrollArea>
  );
}