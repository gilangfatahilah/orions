-- CreateTable
CREATE TABLE "TransactionReport" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "letterCode" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "Outlet" TEXT NOT NULL,
    "Detail" TEXT NOT NULL,

    CONSTRAINT "TransactionReport_pkey" PRIMARY KEY ("id")
);
