const Sentry = require('@sentry/node');
const dotenv = require('dotenv');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

dotenv.config();

Sentry.init({
  dsn: "https://377a42ea761afe5fbdf273b07aa2a74c@o4507877802115072.ingest.us.sentry.io/4507877818171392",
  integration: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
})