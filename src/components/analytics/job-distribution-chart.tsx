"use client"

import React, { useMemo, useState } from "react"
import { Pie, PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Label, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

interface JobDistributionChartProps {
    data: {
        name: string
        value: number
    }[]
}

export function JobDistributionChart({ data }: JobDistributionChartProps) {
    const [mode, setMode] = useState<'pie' | 'bar'>('pie')
    
    // Config: Map data names to CSS variables directly
    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        data.forEach((item, index) => {
            const colorVar = `var(--chart-${(index % 5) + 1})`;
            config[item.name.toLowerCase()] = {
                label: item.name,
                color: colorVar,
            };
        });
        return config;
    }, [data]);

    const total = useMemo(() => data.reduce((acc, d) => acc + (d.value || 0), 0), [data])
    
    if (data.length === 0) {
        return null;
    }

    // Process data to match the config keys
    const processedData = data.map((item) => ({
        ...item,
        fill: `var(--color-${item.name.toLowerCase()})` 
    }));

    return (
        <Card className="col-span-1 border-none shadow-2xl bg-card/40 backdrop-blur-xl group">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <CardTitle className="text-xl font-black">Market Distribution</CardTitle>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Listing composition by type</p>
                    </div>
                    <div className="inline-flex rounded-xl border bg-background/50 p-1 text-[10px] font-black uppercase tracking-widest h-fit">
                        <button
                            className={`px-3 py-1 rounded-lg transition-all ${mode === 'pie' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
                            onClick={() => setMode('pie')}
                        >Donut</button>
                        <button
                            className={`px-3 py-1 rounded-lg transition-all ${mode === 'bar' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
                            onClick={() => setMode('bar')}
                        >Rank</button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {mode === 'pie' ? (
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={processedData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    strokeWidth={2}
                                    stroke="hsl(var(--background))"
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
                                                        <text
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-black"
                                                            textAnchor="middle"
                                                        >
                                                            {total}
                                                        </text>
                                                        <text
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 20}
                                                            className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest"
                                                            textAnchor="middle"
                                                        >
                                                            Jobs
                                                        </text>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap text-[10px] font-black" />
                            </PieChart>
                        ) : (
                            <BarChart 
                                data={processedData} 
                                layout="vertical" 
                                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category"
                                    fontSize={10} 
                                    fontWeight="black" 
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 10)}...` : val}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar 
                                    dataKey="value" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={24}
                                    label={{ 
                                        position: 'right', 
                                        fontSize: 10, 
                                        fontWeight: 'black', 
                                        fill: 'hsl(var(--muted-foreground))',
                                        formatter: (val: number) => `${Math.round((val / (total || 1)) * 100)}%`
                                    }}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
