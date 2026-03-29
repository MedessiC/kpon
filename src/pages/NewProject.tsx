import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const NewProject = () => {
  const navigate = useNavigate();
  const { uploadFile, isLoading, error: uploadError } = useCloudinaryUpload();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    if (!title.trim()) {
      toast.error("Veuillez entrer un titre");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Veuillez entrer un prix valide");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Cloudinary
      toast.loading("Téléchargement du fichier...");
      const uploadResponse = await uploadFile(file);
      setFileUrl(uploadResponse.secure_url);

      // Create project (TODO: save to backend)
      const fakeId = Math.random().toString(36).substring(7);
      const projectData = {
        id: fakeId,
        title,
        description,
        price: Number(price),
        fileUrl: uploadResponse.secure_url,
        fileSize: (file.size / 1024 / 1024).toFixed(1),
        fileType: file.type.split("/")[1]?.toUpperCase() || "FILE",
        createdAt: new Date().toISOString(),
      };

      console.log("Project created:", projectData);

      setCreatedLink(`${window.location.origin}/project/${fakeId}`);
      toast.success("Projet créé avec succès !");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'upload";
      console.error("Upload error:", err);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = createdLink!;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      toast.success("Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleCopy = () => {
    if (createdLink) {
      // Try modern Clipboard API first
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(createdLink).then(() => {
          setCopied(true);
          toast.success("Lien copié !");
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          fallbackCopy();
        });
      } else {
        // Fallback for older browsers or insecure contexts
        fallbackCopy();
      }
    }
  };

  if (createdLink) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Projet créé !</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Partagez ce lien avec votre client pour qu'il puisse voir et payer.
          </p>

          <div className="bg-muted rounded-lg p-3 flex items-center gap-2 mb-4">
            <code className="text-xs flex-1 truncate text-foreground">
              {createdLink}
            </code>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => navigate("/dashboard")}
            >
              Tableau de bord
            </Button>
            <Button
              variant="accent"
              className="flex-1 h-12"
              onClick={() => {
                setCreatedLink(null);
                setTitle("");
                setDescription("");
                setPrice("");
                setFile(null);
              }}
            >
              Nouveau projet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 text-muted-foreground active:text-foreground transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="size-5" />
          </button>
          <Logo />
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full animate-fade-in">
        <h1 className="text-2xl font-extrabold mb-6">Nouveau projet</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">Titre du projet</Label>
            <Input
              id="title"
              placeholder="Ex : Logo Entreprise XYZ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Décrivez brièvement le livrable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-sm font-medium">Prix (FCFA)</Label>
            <Input
              id="price"
              type="number"
              min="100"
              step="100"
              placeholder="25000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Fichier à livrer</Label>
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer active:border-primary/50 active:bg-muted/50 transition-colors"
            >
              <Upload className="size-8 text-muted-foreground mb-2" />
              {file ? (
                <div className="text-center">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} Mo
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium">Appuyez pour sélectionner</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, ZIP, PSD, AI, PNG... (max 50 Mo)
                  </p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <Button
            type="submit"
            variant="accent"
            className="w-full h-12 text-base font-semibold"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer le projet"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default NewProject;
