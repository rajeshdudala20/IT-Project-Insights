import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Project } from "@shared/schema";

interface ProjectsBySizeChartProps {
  projects: Project[];
  businessUnits: string[];
}

export function ProjectsBySizeChart({ projects, businessUnits }: ProjectsBySizeChartProps) {
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>("all");

  // Auto-derive years from data
  const years = useMemo(
    () => Array.from(new Set(projects.map(p => p.year))).sort(),
    [projects]
  );

  // Transform: BU = bars, Year = stacks
  const chartData = useMemo(() => {
    let filtered = projects;
    if (selectedBusinessUnit !== "all") {
      filtered = filtered.filter(p => p.businessUnit === selectedBusinessUnit);
    }

    const byBU: Record<string, Record<number, number>> = {};
    for (const p of filtered) {
      const bu = p.businessUnit;
      const yr = p.year;
      if (!byBU[bu]) byBU[bu] = {};
      if (!byBU[bu][yr]) byBU[bu][yr] = 0;
      byBU[bu][yr]++;
    }

    return Object.entries(byBU).map(([bu, yearMap]) => ({
      businessUnit: bu,
      ...yearMap
    }));
  }, [projects, selectedBusinessUnit]);

  return (
    <Card data-testid="card-chart-projects-by-size">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg" data-testid="title-projects-by-size">
            Project Count by Business Unit
          </CardTitle>
          <CardDescription data-testid="desc-projects-by-size">
            Stacked yearly distribution across business units
          </CardDescription>
        </div>

        <Select value={selectedBusinessUnit} onValueChange={setSelectedBusinessUnit}>
          <SelectTrigger className="w-[160px]" data-testid="select-bu-filter-size">
            <SelectValue placeholder="Business Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            {businessUnits.map(bu => (
              <SelectItem key={bu} value={bu}>{bu}</SelectItem>
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
                dataKey="businessUnit"
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
                formatter={(v: number, y: number) => [`${v} projects`, y]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />

              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "12px" }} />

              {years.map((year, index) => (
                <Bar
                  key={year}
                  dataKey={String(year)}
                  stackId="year"
                  fill={`hsl(var(--chart-${(index % 6) + 1}))`}
                  name={String(year)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}