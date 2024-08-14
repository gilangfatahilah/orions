"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  month: string;
  year: number;
  itemCount: number;  
}

const chartConfig = {
  itemCount: {
    label: "Stock",
    color: "bg-primary",
  },
} satisfies ChartConfig

interface OverviewProps {
  data: ChartData[];
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ChartContainer className="w-full max-h-[340px]" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent color="#fff" hideLabel />}
        />
        <Bar dataKey="itemCount" className="fill-primary" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
