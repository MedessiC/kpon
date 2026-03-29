import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  FileText,
  Eye,
  Download,
  Home,
  FolderPlus,
  BarChart3,
  TrendingUp,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  price: number;
  status: "active" | "paid" | "expired";
  createdAt: string;
  views: number;
  downloads: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Logo Entreprise ABC",
    price: 25000,
    status: "paid",
    createdAt: "2024-03-15",
    views: 12,
    downloads: 1,
  },
  {
    id: "2",
    title: "Charte graphique Studio X",
    price: 75000,
    status: "active",
    createdAt: "2024-03-20",
    views: 5,
    downloads: 0,
  },
  {
    id: "3",
    title: "Flyer événement Accra",
    price: 15000,
    status: "active",
    createdAt: "2024-03-22",
    views: 3,
    downloads: 0,
  },
];

const statusLabels: Record<Project["status"], string> = {
  active: "En attente",
  paid: "Payé",
  expired: "Expiré",
};

const statusConfig: Record<
  Project["status"],
  { bg: string; text: string; dot: string }
> = {
  active: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  paid: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  expired: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>(mockProjects);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const totalRevenue = projects
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.price, 0);

  const totalViews = projects.reduce((s, p) => s + p.views, 0);
  const totalDownloads = projects.reduce((s, p) => s + p.downloads, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col pb-20 sm:pb-0">
      {/* Header - Responsive */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
          <div className="flex-1 max-w-xs sm:max-w-none">
            <Logo />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-xs sm:text-sm"
              onClick={() => navigate("/projects/new")}
            >
              <Plus className="size-4" />
              <span>Nouveau</span>
            </Button>
            <Button
              variant="default"
              size="icon"
              className="sm:hidden h-9 w-9 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              onClick={() => navigate("/projects/new")}
            >
              <Plus className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-accent/10 transition-colors duration-200"
              onClick={() => navigate("/")}
            >
              <LogOut className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section - Responsive Text */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Gérez vos projets et suivez vos statistiques
          </p>
        </div>

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          <StatCard
            label="Projets"
            value={projects.length}
            icon={<FileText className="size-4 sm:size-5" />}
            trend="↑ 2 ce mois"
            color="from-blue-500 to-blue-600"
            delay="0"
            isMobile={typeof window !== "undefined" && window.innerWidth < 640}
          />
          <StatCard
            label="Revenus"
            value={
              totalRevenue > 0
                ? `${(totalRevenue / 1000).toFixed(0)}K`
                : "0"
            }
            icon={<BarChart3 className="size-4 sm:size-5" />}
            trend={`${totalRevenue > 0 ? "+145K" : "0"} FCFA`}
            color="from-emerald-500 to-teal-600"
            delay="100"
            highlight
            isMobile={typeof window !== "undefined" && window.innerWidth < 640}
          />
          <StatCard
            label="Vues"
            value={totalViews}
            icon={<Eye className="size-4 sm:size-5" />}
            trend={`${totalViews > 0 ? "+12" : "0"}%`}
            color="from-purple-500 to-indigo-600"
            delay="200"
            isMobile={typeof window !== "undefined" && window.innerWidth < 640}
          />
          <StatCard
            label="Téléch."
            value={totalDownloads}
            icon={<Download className="size-4 sm:size-5" />}
            trend={`${totalDownloads > 0 ? "+5" : "0"}%`}
            color="from-orange-500 to-rose-600"
            delay="300"
            isMobile={typeof window !== "undefined" && window.innerWidth < 640}
          />
        </div>

        {/* Projects Section */}
        <div className="space-y-3 sm:space-y-5">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="size-4 sm:size-5 text-primary flex-shrink-0" />
                <span className="truncate">Mes Projets</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {projects.length} projet{projects.length > 1 ? "s" : ""} publié
                {projects.length > 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
              onClick={() => navigate("/projects/new")}
            >
              <Plus className="size-3.5 sm:size-4 mr-1.5" />
              Ajouter un projet
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4 border-2 border-dashed rounded-xl sm:rounded-2xl bg-card/50">
              <div className="mb-3 sm:mb-4 inline-flex p-3 sm:p-4 rounded-full bg-accent/10">
                <FileText className="size-6 sm:size-8 text-accent" />
              </div>
              <p className="text-base sm:text-lg font-semibold mb-2">
                Aucun projet pour le moment
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Commencez par créer votre premier projet
              </p>
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-xs sm:text-sm"
                onClick={() => navigate("/projects/new")}
              >
                <Plus className="size-3.5 sm:size-4 mr-1.5" />
                Créer mon premier projet
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={index * 50}
                  isHovered={hoveredProject === project.id}
                  onHover={setHoveredProject}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-md px-3 py-2.5 flex items-center justify-around">
        <NavButton
          icon={<Home className="size-5" />}
          label="Accueil"
          onClick={() => navigate("/dashboard")}
          active
        />
        <NavButton
          icon={<FolderPlus className="size-5" />}
          label="Nouveau"
          onClick={() => navigate("/projects/new")}
        />
        <NavButton
          icon={<LogOut className="size-5" />}
          label="Quitter"
          onClick={() => navigate("/")}
        />
      </nav>
    </div>
  );
};
// Stat Card Component - Fully Responsive
const StatCard = ({
  label,
  value,
  icon,
  trend,
  color,
  delay,
  highlight,
  isMobile,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  color: string;
  delay: string;
  highlight?: boolean;
  isMobile?: boolean;
}) => (
  <div
    className={`group relative rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border transition-all duration-300 cursor-pointer overflow-hidden`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-5 bg-gradient-to-r ${color} transition-opacity duration-300`} />

    <div className="relative space-y-2 sm:space-y-3 md:space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide line-clamp-1">
            {label}
          </p>
        </div>
        <div className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg bg-gradient-to-r ${color} text-white/90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
          {icon}
        </div>
      </div>

      <div>
        <p className={`text-lg sm:text-2xl md:text-3xl font-bold transition-all duration-300 group-hover:scale-105 origin-left line-clamp-1`}>
          {value}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`h-0.5 sm:h-1 flex-1 rounded-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
        <span className={`text-[10px] sm:text-xs font-medium text-right whitespace-nowrap ${highlight ? "text-primary" : "text-muted-foreground"}`}>
          {trend}
        </span>
      </div>
    </div>
  </div>
);

// Project Card Component - Fully Responsive
const ProjectCard = ({
  project,
  delay,
  isHovered,
  onHover,
  navigate,
}: {
  project: Project;
  delay: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  navigate: any;
}) => {
  const config = statusConfig[project.status];

  return (
    <div
      className="group relative rounded-lg sm:rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/50"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => {
        // TODO: navigate to project detail
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative bg-card/50 backdrop-blur-sm p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {new Date(project.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full ${config.bg} ${config.text} text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0`}>
            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${config.dot} animate-pulse`} />
            <span className="hidden sm:inline">{statusLabels[project.status]}</span>
            <span className="sm:hidden">{statusLabels[project.status].split(" ")[0]}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Stats Row - Stack on mobile, inline on larger */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Price */}
          <div className="col-span-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Prix</p>
            <p className="text-sm sm:text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform duration-200 origin-left line-clamp-1">
              {(project.price / 1000).toFixed(0)}K
            </p>
          </div>

          {/* Views */}
          <div className="col-span-1 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Vues</p>
            <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
              <Eye className="size-3 sm:size-4 text-muted-foreground" />
              <span className="text-sm sm:text-base font-semibold">{project.views}</span>
            </div>
          </div>

          {/* Downloads */}
          <div className="col-span-1 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Téléch.</p>
            <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
              <Download className="size-3 sm:size-4 text-muted-foreground" />
              <span className="text-sm sm:text-base font-semibold">{project.downloads}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Visible on hover or always on mobile */}
        {isHovered && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[11px] sm:text-xs h-8 hover:bg-primary/10 border-primary/20"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ExternalLink className="size-3 mr-1" />
              Détails
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent/10"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Nav Button Component - Mobile Optimized
const NavButton = ({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 px-2 py-1.5 rounded-md ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="leading-tight">{label}</span>
  </button>
);

export default Dashboard;
