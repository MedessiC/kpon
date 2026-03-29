/**
 * Supabase Projects Service
 * Handle project operations with Supabase
 */

import { supabase, handleSupabaseError } from "@/lib/supabase";
import { Project, PaginatedResponse } from "@/types";

export const supabaseProjectService = {
  /**
   * Get all projects (paginated)
   */
  async getProjects(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Get projects
      const { data, error } = await supabase
        .from("projects")
        .select("*, users:designer_id(name, email)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: (data || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          price: project.price,
          status: project.status,
          createdAt: project.created_at,
          views: project.views || 0,
          downloads: project.downloads || 0,
          designerId: project.designer_id,
          designerName: project.users?.name || "Unknown",
          fileSize: project.file_size,
          fileType: project.file_type,
          imageUrl: project.image_url,
          images: project.images || [],
        })),
        total: count || 0,
        page,
        pageSize: limit,
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get single project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    try {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*, users:designer_id(name, email)")
        .eq("id", id)
        .limit(1);

      if (error) throw error;

      const data = projects?.[0];
      if (!data) throw new Error("Project not found");

      // Increment views
      await supabase
        .from("projects")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        status: data.status,
        createdAt: data.created_at,
        views: data.views + 1,
        downloads: data.downloads || 0,
        designerId: data.designer_id,
        designerName: data.users?.name || "Unknown",
        fileSize: data.file_size,
        fileType: data.file_type,
        imageUrl: data.image_url,
        images: data.images || [],
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get projects by designer ID
   */
  async getProjectsByDesigner(designerId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("designer_id", designerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        price: project.price,
        status: project.status,
        createdAt: project.created_at,
        views: project.views || 0,
        downloads: project.downloads || 0,
        designerId: project.designer_id,
        designerName: "", // Will be filled from context
        fileSize: project.file_size,
        fileType: project.file_type,
        imageUrl: project.image_url,
        images: project.images || [],
      }));
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create new project
   */
  async createProject(data: {
    title: string;
    description: string;
    price: number;
    fileUrl: string;
    fileSize: string;
    fileType: string;
    imageUrl?: string;
    images?: string[];
  }): Promise<Project> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: projects, error } = await supabase
        .from("projects")
        .insert([
          {
            title: data.title,
            description: data.description,
            price: data.price,
            file_url: data.fileUrl,
            file_size: data.fileSize,
            file_type: data.fileType,
            image_url: data.imageUrl,
            images: data.images || [],
            designer_id: user.id,
            status: "active",
          },
        ] as any)
        .select()
        .limit(1);

      if (error) throw error;

      const project = projects?.[0];
      if (!project) throw new Error("Failed to create project");

      // Get designer info
      const { data: designers } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .limit(1);

      const designer = designers?.[0];

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        price: project.price,
        status: project.status,
        createdAt: project.created_at,
        views: 0,
        downloads: 0,
        designerId: user.id,
        designerName: designer?.name || "Unknown",
        fileSize: project.file_size,
        fileType: project.file_type,
        imageUrl: project.image_url,
        images: project.images || [],
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update project
   */
  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.price && { price: data.price }),
        })
        .eq("id", id);

      if (error) throw error;

      return this.getProjectById(id);
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*, users:designer_id(name)")
        .ilike("title", `%${query}%`)
        .eq("status", "active")
        .limit(20);

      if (error) throw error;

      return (data || []).map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        price: project.price,
        status: project.status,
        createdAt: project.created_at,
        views: project.views || 0,
        downloads: project.downloads || 0,
        designerId: project.designer_id,
        designerName: project.users?.name || "Unknown",
        fileSize: project.file_size,
        fileType: project.file_type,
        imageUrl: project.image_url,
        images: project.images || [],
      }));
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Increment downloads
   */
  async incrementDownloads(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_downloads", {
        project_id: id,
      });

      if (error) {
        // Fallback if RPC not available
        const { data: projects } = await supabase
          .from("projects")
          .select("downloads")
          .eq("id", id)
          .limit(1);

        const project = projects?.[0];
        if (project) {
          await supabase
            .from("projects")
            .update({ downloads: (project.downloads || 0) + 1 })
            .eq("id", id);
        }
      }
    } catch (error: any) {
      console.error("Error incrementing downloads:", error);
    }
  },
};
