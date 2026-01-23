import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, Building2, Layers } from "lucide-react";
import type { ProjectsResponse } from "@shared/schema";

interface SummaryCardsProps {
  data: ProjectsResponse["summary"];
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const currentYear = new Date().getFullYear();
  const currentYearProjects = data.projectsByYear[String(currentYear)] || 0;
  const previousYearProjects = data.projectsByYear[String(currentYear - 1)] || 0;
  const growthRate = previousYearProjects > 0 
    ? Math.round(((currentYearProjects - previousYearProjects) / previousYearProjects) * 100)
    : 0;

  const cards = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      description: `${data.years.length} years of data`,
      icon: Briefcase,
      iconColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "2025 Projects",
      value: data.projectsByYear["2025"] || 0,
      description: `${growthRate >= 0 ? '+' : ''}${growthRate}% from 2024`,
      icon: TrendingUp,
      iconColor: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Business Units",
      value: data.businessUnits.length,
      description: "Active units",
      icon: Building2,
      iconColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Categories",
      value: data.categories.length,
      description: "Project types",
      icon: Layers,
      iconColor: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} data-testid={`card-summary-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid={`value-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
