// Mock data for demonstrations
// This file provides realistic test data when no real API is available

export const MOCK_USERS = [
  {
    id: "user-1",
    email: "kofi@kpon.com",
    name: "Kofi Mensah",
    role: "freelancer",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    email: "ama@kpon.com",
    name: "Ama Osei",
    role: "freelancer",
    createdAt: "2024-02-01T14:20:00Z",
  },
  {
    id: "user-3",
    email: "client@kpon.com",
    name: "Jean Dupont",
    role: "client",
    createdAt: "2024-03-01T08:00:00Z",
  },
];

export const MOCK_PROJECTS = [
  {
    id: "proj-1",
    title: "Logo Entreprise ABC",
    description: "Logo professionnel en haute résolution avec déclinaisons couleur et noir/blanc.",
    price: 25000,
    status: "paid",
    createdAt: "2024-03-15T09:00:00Z",
    views: 12,
    downloads: 1,
    designerId: "user-1",
    designerName: "Kofi Mensah",
    fileSize: "12.4 Mo",
    fileType: "ZIP",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553531088-389e8de1efde?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "proj-2",
    title: "Charte graphique Studio X",
    description: "Charte graphique complète incluant polices, couleurs, icônes et guidelines de marque détaillées.",
    price: 75000,
    status: "active",
    createdAt: "2024-03-20T11:30:00Z",
    views: 5,
    downloads: 0,
    designerId: "user-1",
    designerName: "Kofi Mensah",
    fileSize: "35.2 Mo",
    fileType: "ZIP",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "proj-3",
    title: "Flyer événement Accra",
    description: "Flyer double face pour événement culturel avec impression professionnelle.",
    price: 15000,
    status: "active",
    createdAt: "2024-03-22T15:45:00Z",
    views: 3,
    downloads: 0,
    designerId: "user-2",
    designerName: "Ama Osei",
    fileSize: "8.7 Mo",
    fileType: "PDF",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "proj-4",
    title: "Branding e-commerce Textile",
    description: "Identité visuelle complète pour boutique en ligne avec logo, palette couleur et templates UI.",
    price: 120000,
    status: "active",
    createdAt: "2024-03-25T08:15:00Z",
    views: 28,
    downloads: 2,
    designerId: "user-2",
    designerName: "Ama Osei",
    fileSize: "58.3 Mo",
    fileType: "ZIP",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ],
  },
];

export const MOCK_PAYMENTS = [
  {
    transactionId: "txn-001",
    projectId: "proj-1",
    amount: 25000,
    status: "completed",
    createdAt: "2024-03-16T10:20:00Z",
  },
  {
    transactionId: "txn-002",
    projectId: "proj-4",
    amount: 120000,
    status: "completed",
    createdAt: "2024-03-26T14:05:00Z",
  },
];

export const MOCK_STATS = {
  totalProjects: 4,
  totalEarnings: 235000,
  totalDownloads: 3,
  totalConfirmedPayments: 2,
  projectsThisMonth: 2,
};

// Simulate API delay
export function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo mode detection
export function isDemoMode(): boolean {
  return import.meta.env.VITE_APP_ENV === "development" || 
         import.meta.env.VITE_USE_MOCK_DATA === "true";
}
