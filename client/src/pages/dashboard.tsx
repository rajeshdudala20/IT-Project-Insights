import { useQuery } from "@tanstack/react-query";
import { SummaryCards } from "@/components/summary-cards";
import { ProjectsByYearChart } from "@/components/charts/projects-by-year-chart";
import { ProjectsByBusinessUnitChart } from "@/components/charts/projects-by-business-unit-chart";
import { ProjectsByCategoryChart } from "@/components/charts/projects-by-category-chart";
import { ProjectsBySizeChart } from "@/components/charts/projects-by-size-chart";
import { ProjectsTable } from "@/components/projects-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { ProjectsResponse } from "@shared/schema";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<ProjectsResponse>({
    queryKey: ["/api/projects"],
  });
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground" data-testid="icon-dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold leading-tight" data-testid="text-dashboard-title">IT Projects Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden sm:block" data-testid="text-dashboard-subtitle">KLG Group Portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Sign out"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <Card className="border-destructive">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive font-medium mb-2">Failed to load projects</p>
                <p className="text-sm text-muted-foreground">
                  Please try refreshing the page.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <DashboardSkeleton />
        ) : data ? (
          <div className="space-y-6">
            <SummaryCards data={data.summary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProjectsByYearChart data={data.summary.projectsByYear} />
              <ProjectsByBusinessUnitChart data={data.summary.projectsByBusinessUnit} />
              <ProjectsByCategoryChart data={data.summary.projectsByCategory} />
              <ProjectsBySizeChart data={data.summary.projectsBySize} />
            </div>

            <ProjectsTable projects={data.projects} summary={data.summary} />
          </div>
        ) : null}
      </main>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-muted-foreground">
            IT Projects Dashboard - KLG Group
          </p>
        </div>
      </footer>
    </div>
  );
}
