import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export function initSentry(): void {
  const environment = import.meta.env.VITE_APP_ENV || "development";
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn("Sentry DSN not configured");
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,
    beforeSend(event) {
      if (environment === "development") {
        console.error("[Sentry Event]", event);
      }
      return event;
    },
  });
}

export { Sentry };
