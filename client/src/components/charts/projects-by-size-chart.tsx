import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ProjectsResponse } from "@shared/schema";

interface ProjectsBySizeChartProps {
  data: ProjectsResponse["summary"]["projectsBySize"];
}

export function ProjectsBySizeChart({ data }: ProjectsBySizeChartProps) {
  const sizeOrder = ["XL", "L", "M", "S"];
  const sizeLabels: Record<string, string> = {
    XL: "Extra Large",
    L: "Large",
    M: "Medium",
    S: "Small",
  };
  
  const sizeColors: Record<string, string> = {
    XL: "hsl(var(--chart-5))",
    L: "hsl(var(--chart-1))",
    M: "hsl(var(--chart-2))",
    S: "hsl(var(--chart-3))",
  };

  const chartData = sizeOrder
    .filter(size => data[size] !== undefined)
    .map(size => ({
      size,
      label: sizeLabels[size] || size,
      count: data[size] || 0,
      color: sizeColors[size] || "hsl(var(--chart-1))",
    }));

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card data-testid="card-chart-projects-by-size">
      <CardHeader>
        <CardTitle className="text-lg" data-testid="title-projects-by-size">Project Sizes</CardTitle>
        <CardDescription data-testid="desc-projects-by-size">Distribution by project complexity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis 
                dataKey="size" 
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
                formatter={(value: number, name: string, props: any) => [
                  `${value} projects (${((value / total) * 100).toFixed(1)}%)`,
                  props.payload.label
                ]}
                labelFormatter={() => ""}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Projects">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
