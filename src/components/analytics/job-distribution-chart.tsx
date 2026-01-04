"use client"

import React, { useMemo, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobDistributionChartProps {
    data: {
        name: string
        value: number
    }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function JobDistributionChart({ data }: JobDistributionChartProps) {
    const [mode, setMode] = useState<'pie' | 'bar'>('pie')
    const total = useMemo(() => data.reduce((acc, d) => acc + (d.value || 0), 0), [data])
    if (data.length === 0) {
        return null;
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <CardTitle>
                        Job Type Distribution <span className="text-sm font-normal text-muted-foreground">· n={total}</span>
                    </CardTitle>
                    <div className="inline-flex rounded-md border bg-background p-0.5 text-xs">
                        <button
                            className={`px-2 py-1 rounded-sm ${mode === 'pie' ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setMode('pie')}
                            aria-pressed={mode === 'pie'}
                        >Pie</button>
                        <button
                            className={`px-2 py-1 rounded-sm ${mode === 'bar' ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setMode('bar')}
                            aria-pressed={mode === 'bar'}
                        >Bar</button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {mode === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value?: number, name?: string) => {
                                        const count = value ?? 0
                                        const pct = total ? Math.round((count / total) * 100) : 0
                                        return [`${count} (${pct}%)`, name ?? 'Jobs']
                                    }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        ) : (
                            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={0} tickMargin={8} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value?: number, name?: string) => {
                                        const count = value ?? 0
                                        const pct = total ? Math.round((count / total) * 100) : 0
                                        return [`${count} (${pct}%)`, name ?? 'Jobs']
                                    }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
