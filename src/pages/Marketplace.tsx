import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Eye,
  Star,
  Filter,
  LogOut,
} from "lucide-react";
import { useProjects } from "@/hooks/useProject";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "active" | "paid" | "expired";
  createdAt: string;
  views: number;
  downloads: number;
  designerId: string;
  designerName: string;
  imageUrl?: string;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: projectsData, isLoading, error } = useProjects(1, 100);
  const [cartCount, setCartCount] = useState(0);

  const projects = projectsData?.data || [];

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.designerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (project: Project) => {
    setCartCount(cartCount + 1);
    // Toast notification would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col pb-20 sm:pb-0">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden sm:flex relative w-48">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Chercher un projet..."
                className="pl-9 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => navigate("/")}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Découvrez nos créations
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Parcourez les meilleurs projets de design disponibles
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-2 sm:gap-3">
            <div className="sm:hidden flex-1 relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Chercher..."
                className="pl-9 h-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5">
              <Filter className="size-4" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredProjects.map((project) => (
            <ProjectTile
              key={project.id}
              project={project}
              onAddToCart={handleAddToCart}
              navigate={navigate}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aucun projet trouvé</p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </main>

      {/* Mobile Search Bar at Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-card px-3 py-3 flex gap-2">
        <Input
          placeholder="Chercher..."
          className="h-9 text-xs flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button size="icon" className="h-9 w-9">
          <Search className="size-4" />
        </Button>
      </div>
    </div>
  );
};

// Project Tile Component
const ProjectTile = ({
  project,
  onAddToCart,
  navigate,
}: {
  project: Project;
  onAddToCart: (project: Project) => void;
  navigate: any;
}) => {
  const rating = Math.floor(Math.random() * 5) + 1;

  return (
    <div
      className="group relative rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer bg-card"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 bg-muted">
        <img
          src={project.imageUrl || "https://via.placeholder.com/400x300?text=Design"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=Design";
          }}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project.id}`);
            }}
          >
            Voir
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(project);
            }}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">
          {project.price.toLocaleString()} FCFA
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            par {project.designerName}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Eye className="size-3 text-muted-foreground" />
            <span className="text-muted-foreground">{project.views}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full h-8 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(project);
          }}
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default Marketplace;
