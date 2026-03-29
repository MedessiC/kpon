import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useNavigate, useParams } from "react-router-dom";
import {
  Download,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Share2,
  Heart,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const project = MOCK_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Projet non trouvé</p>
          <Button onClick={() => navigate("/marketplace")}>
            Retour à la marketplace
          </Button>
        </div>
      </div>
    );
  }

  const images = project.images || [project.imageUrl || "https://via.placeholder.com/800x600"];
  const currentImage = images[selectedImageIndex];

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 max-w-7xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => navigate("/marketplace")}
            >
              <ChevronLeft className="size-4" />
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

      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Gallery */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                <img
                  src={currentImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/800x600";
                  }}
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-xs">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === idx
                          ? "border-primary"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/100x100";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Info & Actions */}
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky top-20">
                {/* Header */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {project.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-4">
                    par <span className="font-semibold text-foreground">
                      {project.designerName}
                    </span>
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {(project.price / 1000).toFixed(0)}K
                    </span>
                    <span className="text-sm text-muted-foreground">FCFA</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full gap-2 h-10">
                    <ShoppingCart className="size-4" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" className="w-full gap-2 h-10">
                    <Download className="size-4" />
                    Aperçu HD
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart
                        className={`size-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Share2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Vues</p>
                    <p className="font-semibold text-sm">{project.views}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Téléch.</p>
                    <p className="font-semibold text-sm">{project.downloads}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Taille</p>
                    <p className="font-semibold text-sm">{project.fileSize}</p>
                  </div>
                </div>

                {/* Designer Info */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Designer</p>
                      <p className="font-semibold">{project.designerName}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir le profil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
