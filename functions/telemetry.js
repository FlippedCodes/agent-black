const Sentry = require('@sentry/node');

const packageFile = require('../package.json');

Sentry.init({
  dsn: process.env.sentryLink,
  enabled: !!process.env.sentryLink,
  release: packageFile.version,
});
