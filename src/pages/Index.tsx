import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Palette,
  ShoppingBag,
  Lock,
  Smartphone,
  Users,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
          >
            Connexion
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-accent/20">
            <Zap className="size-3.5" />
            Plateforme de design #1 en Afrique de l'Ouest
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Trouvez le design parfait ou
            <span className="block text-primary">vendez vos créations</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Kpon connecte les designers talentueux avec les clients qui cherchent des créations uniques. Secure, rapide, et transparent.
          </p>

          {/* Dual CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-6 border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-950 rounded-lg w-fit mx-auto">
                <Palette className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Vous êtes Designer ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Vendez vos projets et générez des revenus
              </p>
              <Button
                className="w-full gap-2"
                onClick={() => navigate("/auth")}
              >
                Commencer à vendre
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="p-6 border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950 rounded-lg w-fit mx-auto">
                <ShoppingBag className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Vous cherchez du Design ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Découvrez des créations uniques et qualitatives
              </p>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate("/marketplace")}
              >
                Explorer la marketplace
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Pourquoi choisir KPON ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <Lock className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">100% Sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Paiement protégé & escrow system pour votre tranquillité
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <Users className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Designers Vérifiés</h3>
              <p className="text-sm text-muted-foreground">
                Portfolios certifiés et reviews authentiques
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <TrendingUp className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Croissance Garantie</h3>
              <p className="text-sm text-muted-foreground">
                Outils marketing inclus pour vendre plus
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <Smartphone className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Mobile First</h3>
              <p className="text-sm text-muted-foreground">
                Plateforme optimisée pour tous les appareils
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <CheckCircle2 className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Support 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Équipe responsive en français & anglais
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="mb-4">
                <Zap className="size-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Paiement Instant</h3>
              <p className="text-sm text-muted-foreground">
                Retrait mobile money sans frais cachés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 md:py-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center p-8 md:p-12 border-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Rejoignez des centaines de designers et clients qui font confiance à KPON
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="gap-2"
              >
                S'inscrire gratuitement
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/marketplace")}
              >
                Explorer la marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto py-8 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 KPON - Développé par MIDEESSI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
