"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react"

interface ChartProps {
  data: { label: string, value: number, fill: string }[]
  previousMonthStock: number;
}

const chartConfig: ChartConfig = {
  items: {
    label: "Items",
  }
}

export function TotalStocks({ data, previousMonthStock }: Readonly<ChartProps>) {
  const totalStocks = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data]);

  const aggregatedStocks = React.useMemo(() => {
    const result = ((totalStocks - previousMonthStock) / previousMonthStock) * 100;
    return isNaN(result) ? 0.00 : result; 
  }, [totalStocks, previousMonthStock]);
  
  const parsedAggregatedStocks = isNaN(aggregatedStocks) ? '0.00' : aggregatedStocks.toFixed(2);

  return (
    <Card className="flex flex-col max-h-[500px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Current Item Stocks</CardTitle>
        <CardDescription>Summary of currently item stock in warehouse.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[325px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStocks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total items
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {
          aggregatedStocks < 0 ? (
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending down by {parsedAggregatedStocks}% this month <TrendingDown className="h-4 w-4" />
            </div>
          ) : aggregatedStocks === 0 ? (
            <div className="flex items-center gap-2 font-medium leading-none">
              There&apos;s no transaction since last month <Sparkles className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by {parsedAggregatedStocks}% this month <TrendingUp className="h-4 w-4" />
            </div>
          )
        }
        <div className="leading-none text-muted-foreground">
          Showing latest total item stocks in warehouse.
        </div>
      </CardFooter>
    </Card>
  )
}
