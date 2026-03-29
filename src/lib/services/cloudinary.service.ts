/**
 * Cloudinary Service
 * Handles file uploads to Cloudinary for KPON projects
 */

interface CloudinaryResponse {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: string;
  format: string;
  size: number;
  created_at: string;
}

interface UploadOptions {
  folder?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  tags?: string[];
  overwrite?: boolean;
}

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;

  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || "";

    if (!this.cloudName) {
      console.warn("Cloudinary cloud name not configured");
    }
    if (!this.uploadPreset) {
      console.warn("Cloudinary upload preset not configured");
    }
  }

  /**
   * Upload file to Cloudinary
   * Uses unsigned uploads (no API key needed client-side)
   */
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<CloudinaryResponse> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error(
        "Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);
    formData.append("cloud_name", this.cloudName);

    // Add optional parameters
    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.tags) {
      formData.append("tags", options.tags.join(","));
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || "Failed to upload file to Cloudinary"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: File[],
    options: UploadOptions = {}
  ): Promise<CloudinaryResponse[]> {
    const uploads = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploads);
  }

  /**
   * Get secure URL for a public_id
   */
  getSecureUrl(publicId: string): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}`;
  }

  /**
   * Get optimized URL with transformations
   */
  getOptimizedUrl(publicId: string, width: number = 800, height: number = 600): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto/${publicId}`;
  }
}

export const cloudinaryService = new CloudinaryService();
