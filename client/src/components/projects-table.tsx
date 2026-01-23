import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import type { Project, ProjectsResponse } from "@shared/schema";

interface ProjectsTableProps {
  projects: Project[];
  summary: ProjectsResponse["summary"];
}

const sizeColors: Record<string, string> = {
  XL: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  L: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  M: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  S: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

export function ProjectsTable({ projects, summary }: ProjectsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.businessUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = yearFilter === "all" || String(project.year) === yearFilter;
      const matchesBusinessUnit = businessUnitFilter === "all" || project.businessUnit === businessUnitFilter;
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

      return matchesSearch && matchesYear && matchesBusinessUnit && matchesCategory;
    });
  }, [projects, searchQuery, yearFilter, businessUnitFilter, categoryFilter]);

  return (
    <Card data-testid="card-projects-table">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg" data-testid="title-all-projects">All Projects</CardTitle>
            <CardDescription data-testid="text-projects-count">
              Showing {filteredProjects.length} of {projects.length} projects
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full sm:w-[130px]" data-testid="select-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {summary.years.sort((a, b) => b - a).map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={businessUnitFilter} onValueChange={setBusinessUnitFilter}>
            <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-business-unit">
              <SelectValue placeholder="Business Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {summary.businessUnits.sort().map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {summary.categories.sort().map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Year</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Business Unit</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="w-[80px] text-center">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No projects found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                    <TableCell className="font-medium">{project.year}</TableCell>
                    <TableCell>
                      <div className="font-medium">{project.project}</div>
                      <div className="md:hidden text-sm text-muted-foreground">
                        {project.businessUnit}
                      </div>
                      <div className="lg:hidden md:hidden text-xs text-muted-foreground">
                        {project.category}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {project.businessUnit}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {project.category}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`${sizeColors[project.size] || ""} font-medium`}
                      >
                        {project.size}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
