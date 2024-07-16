import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import BreadCrumb from "@/components/breadcrumb";

const breadcrumbItems = [{ title: 'Report', link: '/dashboard/report' }];

const ReportPage = () => {
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className='flex items-center justify-between'>
        <Heading title='Report' description='View and track report&apos;s summary here.' />
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full md:w-1/4 mb-2 grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="summary">
        </TabsContent>
        <TabsContent value="history">
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportPage