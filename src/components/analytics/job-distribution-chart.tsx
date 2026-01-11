"use client"

import React, { useMemo, useState } from "react"
import { Pie, PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
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
    
    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        data.forEach((item, index) => {
            config[item.name.toLowerCase()] = {
                label: item.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
        });
        return config;
    }, [data]);

    const total = useMemo(() => data.reduce((acc, d) => acc + (d.value || 0), 0), [data])
    
    if (data.length === 0) {
        return null;
    }

    const processedData = data.map(item => ({
        ...item,
        fill: `var(--color-${item.name.toLowerCase()})`
    }));

    return (
        <Card className="col-span-1 border-none shadow-2xl bg-card/40 backdrop-blur-xl">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl font-black">
                        Market Distribution <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full ml-2">n={total}</span>
                    </CardTitle>
                    <div className="inline-flex rounded-xl border bg-background/50 p-1 text-[10px] font-black uppercase tracking-widest">
                        <button
                            className={`px-3 py-1 rounded-lg transition-all ${mode === 'pie' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
                            onClick={() => setMode('pie')}
                        >Pie</button>
                        <button
                            className={`px-3 py-1 rounded-lg transition-all ${mode === 'bar' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
                            onClick={() => setMode('bar')}
                        >Bar</button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    {mode === 'pie' ? (
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={processedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                strokeWidth={2}
                                stroke="hsl(var(--background))"
                            />
                            <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap" />
                        </PieChart>
                    ) : (
                        <BarChart data={processedData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                            <XAxis 
                                dataKey="name" 
                                fontSize={10} 
                                fontWeight="bold" 
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                fontSize={10}
                                fontWeight="bold"
                                allowDecimals={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar 
                                dataKey="value" 
                                radius={[6, 6, 0, 0]} 
                                barSize={32}
                            />
                        </BarChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
