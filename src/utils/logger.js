export function log(...args) {
  // Minimal logger; avoids leaking to console in production
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[logger]', ...args);
  }
}
