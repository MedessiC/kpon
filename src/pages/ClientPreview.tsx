import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Shield, Lock, CreditCard, Download, CheckCircle } from "lucide-react";

const ClientPreview = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  // Mock project data
  const project = {
    title: "Logo Entreprise ABC",
    designerName: "Kofi Mensah",
    price: 25000,
    description: "Logo final en haute résolution avec déclinaisons couleur.",
    fileType: "ZIP",
    fileSize: "12.4 Mo",
  };

  const handlePay = () => {
    setPayLoading(true);
    // TODO: Integrate FedaPay
    setTimeout(() => {
      setPayLoading(false);
      setIsPaid(true);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paiement confirmé !</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Votre fichier est prêt à être téléchargé.
          </p>

          <div className="border rounded-xl p-4 mb-6 bg-card">
            <p className="font-semibold">{project.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {project.fileType} • {project.fileSize}
            </p>
          </div>

          <Button variant="accent" className="w-full h-12 text-base font-semibold">
            <Download className="size-5" />
            Télécharger le fichier
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Lien de téléchargement valide 72h
          </p>
        </div>

        <footer className="mt-12">
          <Logo className="text-lg opacity-50" />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-center h-14 px-4">
          <Logo />
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full animate-fade-in">
        {/* Designer info */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-foreground font-bold text-lg">
              {project.designerName.charAt(0)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {project.designerName} vous a envoyé un fichier
          </p>
        </div>

        {/* Project card */}
        <div className="border rounded-xl overflow-hidden bg-card mb-5">
          {/* Watermarked preview area */}
          <div className="relative bg-muted aspect-[4/3] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-extrabold text-primary/5 rotate-[-30deg] select-none pointer-events-none">
                KPON
              </div>
            </div>
            <div className="relative z-10 text-center p-6">
              <Lock className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-sm">Aperçu protégé</p>
              <p className="text-xs text-muted-foreground mt-1">
                Payez pour accéder au fichier complet
              </p>
            </div>
          </div>

          <div className="p-4">
            <h1 className="text-xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>{project.fileType}</span>
              <span>{project.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Price + Pay — sticky on mobile */}
        <div className="border rounded-xl p-4 bg-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Montant</span>
            <span className="text-2xl font-bold text-primary">
              {project.price.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <Button
            variant="accent"
            className="w-full h-12 text-base font-semibold"
            onClick={handlePay}
            disabled={payLoading}
          >
            <CreditCard className="size-5" />
            {payLoading ? "Traitement..." : "Payer avec Mobile Money"}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            MTN Mobile Money • Moov Money
          </p>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="size-3.5" />
            Paiement sécurisé
          </span>
          <span className="flex items-center gap-1">
            <Lock className="size-3.5" />
            Fichier protégé
          </span>
        </div>
      </main>
    </div>
  );
};

export default ClientPreview;
