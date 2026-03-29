import { apiClient } from "@/lib/api-client";
import { Project, PaginatedResponse, FileUploadResponse } from "@/types";
import { ProjectFormData } from "@/lib/schemas";

export const projectService = {
  async getProjects(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> {
    return apiClient.get(`/projects?page=${page}&limit=${limit}`);
  },

  async getProjectById(id: string): Promise<Project> {
    return apiClient.get(`/projects/${id}`);
  },

  async createProject(data: ProjectFormData & { file: File }): Promise<Project> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("file", data.file);

    return apiClient.post("/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    return apiClient.put(`/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<void> {
    return apiClient.delete(`/projects/${id}`);
  },

  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async getDownloadLink(projectId: string): Promise<{ url: string; expiresIn: number }> {
    return apiClient.post(`/projects/${projectId}/download-link`);
  },
};
