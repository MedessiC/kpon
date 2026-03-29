import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseProjectService, cloudinaryService } from "@/lib/services";
import { Project, PaginatedResponse } from "@/types";
import { ProjectFormData } from "@/lib/schemas";
import { handleError } from "@/lib/error-handler";

export function useProjects(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedResponse<Project>>({
    queryKey: ["projects", page, limit],
    queryFn: () => supabaseProjectService.getProjects(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => supabaseProjectService.getProjectById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<{ title: string; description: string; price: number; fileUrl: string; fileSize: string; fileType: string; imageUrl?: string; images?: string[] }>) => {
      try {
        return await supabaseProjectService.createProject(data as any);
      } catch (error) {
        handleError(error, "createProject");
        throw error;
      }
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", newProject.id], newProject);
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ProjectFormData>) => {
      try {
        return await supabaseProjectService.updateProject(id, data);
      } catch (error) {
        handleError(error, "updateProject");
        throw error;
      }
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["projects", id], updatedProject);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await supabaseProjectService.deleteProject(id);
      } catch (error) {
        handleError(error, "deleteProject");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      try {
        return await cloudinaryService.uploadFile(file);
      } catch (error) {
        handleError(error, "uploadFile");
        throw error;
      }
    },
  });
}
