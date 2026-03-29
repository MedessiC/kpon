import { toast } from "sonner";
import * as Sentry from "@sentry/react";
import { ApiError } from "@/types";

export function handleError(error: unknown, context?: string): ApiError {
  let apiError: ApiError;

  if (isApiError(error)) {
    apiError = error;
  } else if (error instanceof Error) {
    apiError = {
      message: error.message,
      code: "UNKNOWN_ERROR",
      statusCode: 0,
    };
  } else {
    apiError = {
      message: "Une erreur inconnue est survenue",
      code: "UNKNOWN_ERROR",
      statusCode: 0,
    };
  }

  // Log to Sentry
  Sentry.captureException(error, {
    contexts: {
      error: {
        context,
        details: apiError,
      },
    },
  });

  // Show toast notification
  toast.error(apiError.message);

  return apiError;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    "statusCode" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inconnue est survenue";
}
