import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Project } from "@shared/schema";

interface ProjectsByYearChartProps {
  projects: Project[];
  sizes: string[];
}

export function ProjectsByYearChart({ projects, sizes }: ProjectsByYearChartProps) {
  const [selectedSize, setSelectedSize] = useState<string>("all");

  // Transform dataset for stacking
  const chartData = useMemo(() => {
    const filtered = selectedSize === "all"
      ? projects
      : projects.filter(p => p.size === selectedSize);

    const byYear: Record<string, { S: number; M: number; L: number; XL: number; XXL: number }> = {};

    for (const p of filtered) {
      const year = String(p.year);
      if (!byYear[year]) {
        byYear[year] = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
      }

      if (p.size === "S") byYear[year].S++;
      if (p.size === "M") byYear[year].M++;
      if (p.size === "L") byYear[year].L++;
      if (p.size === "XL") byYear[year].XL++;
      if (p.size === "XXL") byYear[year].XXL++;
    }

    return Object
      .entries(byYear)
      .map(([year, buckets]) => ({ year, ...buckets }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [projects, selectedSize]);

  return (
    <Card data-testid="card-chart-projects-by-year">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg" data-testid="title-projects-by-year">Project T-Shirt Sizing by Year</CardTitle>
          <CardDescription data-testid="desc-projects-by-year">
            Annual distribution of IT projects by size
          </CardDescription>
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

              {/* Tooltip back for detailed insight */}
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

              {/* Legend to label sizes */}
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: "12px", marginBottom: "4px" }}
              />

              {/* Stacked bars: S -> M -> L -> XL -> XXL */}
              <Bar dataKey="S"   stackId="size" fill="hsl(var(--chart-1))" name="S" />
              <Bar dataKey="M"   stackId="size" fill="hsl(var(--chart-2))" name="M" />
              <Bar dataKey="L"   stackId="size" fill="hsl(var(--chart-3))" name="L" />
              <Bar dataKey="XL"  stackId="size" fill="hsl(var(--chart-4))" name="XL" />
              <Bar dataKey="XXL" stackId="size" fill="hsl(var(--chart-5))" name="XXL" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}