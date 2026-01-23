import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ProjectsResponse } from "@shared/schema";

interface ProjectsByCategoryChartProps {
  data: ProjectsResponse["summary"]["projectsByCategory"];
}

export function ProjectsByCategoryChart({ data }: ProjectsByCategoryChartProps) {
  const chartData = Object.entries(data)
    .map(([category, count]) => ({
      category: category.length > 20 ? category.substring(0, 20) + "..." : category,
      fullCategory: category,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 categories

  return (
    <Card data-testid="card-chart-projects-by-category">
      <CardHeader>
        <CardTitle className="text-lg" data-testid="title-projects-by-category">Top Categories</CardTitle>
        <CardDescription data-testid="desc-projects-by-category">Most common project types</CardDescription>
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
                width={120}
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
