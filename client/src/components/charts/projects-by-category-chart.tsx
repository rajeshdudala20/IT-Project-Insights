import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Project } from "@shared/schema";

interface ProjectsByCategoryChartProps {
  projects: Project[];
  years: number[];
}

export function ProjectsByCategoryChart({ projects, years }: ProjectsByCategoryChartProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const chartData = useMemo(() => {
    const filtered = selectedYear === "all" 
      ? projects 
      : projects.filter(p => String(p.year) === selectedYear);
    
    const byCategory: Record<string, number> = {};
    for (const project of filtered) {
      byCategory[project.category] = (byCategory[project.category] || 0) + 1;
    }
    
    return Object.entries(byCategory)
      .map(([category, count]) => ({
        category: category.length > 25 ? category.substring(0, 25) + "..." : category,
        fullCategory: category,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [projects, selectedYear]);

  return (
    <Card data-testid="card-chart-projects-by-category">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg" data-testid="title-projects-by-category">Top Categories</CardTitle>
          <CardDescription data-testid="desc-projects-by-category">Most common project types</CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]" data-testid="select-year-filter-cat">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} projects`,
                  props.payload.fullCategory
                ]}
                labelFormatter={() => ""}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--chart-1))" 
                radius={[0, 4, 4, 0]} 
                name="Projects"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
