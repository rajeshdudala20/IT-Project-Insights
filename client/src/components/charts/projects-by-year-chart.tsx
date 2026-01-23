import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { Project } from "@shared/schema";

interface ProjectsByYearChartProps {
  projects: Project[];
  sizes: string[];
}

export function ProjectsByYearChart({ projects, sizes }: ProjectsByYearChartProps) {
  const [selectedSize, setSelectedSize] = useState<string>("all");

  const chartData = useMemo(() => {
    const filtered = selectedSize === "all" 
      ? projects 
      : projects.filter(p => p.size === selectedSize);
    
    const byYear: Record<string, number> = {};
    for (const project of filtered) {
      const year = String(project.year);
      byYear[year] = (byYear[year] || 0) + 1;
    }
    
    return Object.entries(byYear)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [projects, selectedSize]);

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-1))",
  ];

  return (
    <Card data-testid="card-chart-projects-by-year">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg" data-testid="title-projects-by-year">Projects by Year</CardTitle>
          <CardDescription data-testid="desc-projects-by-year">Annual distribution of IT projects</CardDescription>
        </div>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-[120px]" data-testid="select-size-filter">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {sizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis 
                dataKey="year" 
                className="text-xs fill-muted-foreground" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-xs fill-muted-foreground" 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Projects">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
