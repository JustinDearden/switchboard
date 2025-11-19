import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://2b63051c5c041298afae68159f02b426@o4510217093054464.ingest.us.sentry.io/4510217096462336',

  integrations: [
    Sentry.consoleIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
