import { useState } from "react";
import { cloudinaryService } from "@/lib/services/cloudinary.service";

interface UseCloudinaryUploadState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export const useCloudinaryUpload = () => {
  const [state, setState] = useState<UseCloudinaryUploadState>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  const uploadFile = async (file: File, folder: string = "kpon/projects") => {
    setState({ isLoading: true, error: null, progress: 0 });

    try {
      setState((prev) => ({ ...prev, progress: 25 }));

      const response = await cloudinaryService.uploadFile(file, {
        folder,
        tags: ["kpon", "project"],
      });

      setState((prev) => ({ ...prev, progress: 100 }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setState({
        isLoading: false,
        error: errorMessage,
        progress: 0,
      });
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const uploadMultiple = async (
    files: File[],
    folder: string = "kpon/projects"
  ) => {
    setState({ isLoading: true, error: null, progress: 0 });

    try {
      const responses = await cloudinaryService.uploadMultiple(files, {
        folder,
        tags: ["kpon", "project"],
      });

      setState((prev) => ({ ...prev, progress: 100 }));
      return responses;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setState({
        isLoading: false,
        error: errorMessage,
        progress: 0,
      });
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getOptimizedUrl = (publicId: string, width?: number, height?: number) => {
    return cloudinaryService.getOptimizedUrl(publicId, width, height);
  };

  return {
    uploadFile,
    uploadMultiple,
    getOptimizedUrl,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,
  };
};
