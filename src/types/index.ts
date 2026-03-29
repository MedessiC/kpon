export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role: "freelancer" | "client" | "admin";
}

export interface Project {
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
  fileSize?: string;
  fileType?: string;
  imageUrl?: string;
  images?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FileUploadResponse {
  url: string;
  key: string;
  size: number;
}
