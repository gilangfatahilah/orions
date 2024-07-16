import Logo from "./layout/logo";
import React, { forwardRef } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { TransactionDetail } from "@/constants/data";
import { formatCurrency, formatDate } from "@/lib/formatter";
import { Icons } from "./icons";
import Image from "next/image";

interface DetailTransactionProps {
  data: TransactionDetail;
}

const DetailTransaction = forwardRef<HTMLDivElement, DetailTransactionProps>(({ data }, ref) => {
  return (
    <Card className="w-full max-w-4xl" ref={ref}>
      <CardHeader className="flex flex-col items-start gap-4 border-b pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Logo size={48} imgClass="" />
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold">Orion Inv.</h2>
            <p className="text-sm text-muted-foreground">Baker Street 221B, 031201</p>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-muted-foreground">Transaction</p>
          <p className="text-2xl font-semibold">INV-{data.id.toUpperCase().slice(0, 12)}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 py-6">
        <div className="grid grid-cols-2 content-end gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground font-medium">Transaction Date</p>
            <p className="text-base">{formatDate(data.transactionDate)}</p>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Transaction Type</p>
            <p className="text-base">{data.type}</p>
            <p className="mt-2 text-sm text-muted-foreground font-medium">Managed By</p>
            <p className="text-base">{data.user.name}</p>
          </div>
          <div className="flex flex-col place-self-end self-end w-1/2 gap-1 items-end">
            <p className="text-sm mb-1 text-muted-foreground font-medium">{data.type === 'ISSUING' ? 'Outlet' : 'Supplier'}</p>
            <p className="text-base text-end">{data.type === 'ISSUING' ? data.outlet?.name : data.supplier?.name}</p>
            <p className="text-base text-end">{data.type === 'ISSUING' ? data.outlet?.phone : data.supplier?.phone}</p>
            <p className="text-base text-end">{data.type === 'ISSUING' ? data.outlet?.address : data.supplier?.address}</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="text-start">Description</TableHead>
              <TableHead className="text-end">Quantity</TableHead>
              <TableHead className="text-end">Unit Price</TableHead>
              <TableHead className="text-end">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.detail.map((detail) => (
              <TableRow className="text-end" key={detail.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {detail.item.image !== null ? (
                      <Image src={detail.item.image} alt={detail.item.name} width={36} height={36} />
                    ) : (
                      <Icons.item className="w-[32px] h-[32px]" />
                    )}
                    {detail.item.name}
                  </div>
                </TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>{formatCurrency(detail.item.price)}</TableCell>
                <TableCell>{formatCurrency(detail.item.price * detail.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div />
          <div className="text-right">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Subtotal</p>
                <p>$250.00</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Tax (8%)</p>
                <p>$20.00</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <p>Total Due</p>
                <p>$270.00</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 pb-2">
        <p className="text-xs text-center tracking-tight w-full text-muted-foreground">
          Orion Inv, Baker Street 221B.
          <br />
          This app was built by Gilang Fatahilah as a college final project.
        </p>
      </CardFooter>
    </Card>
  );
});

DetailTransaction.displayName = "DetailTransaction";

export default DetailTransaction;
