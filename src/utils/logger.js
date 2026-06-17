/* eslint-disable no-console */

const APP_PREFIX = '[rewards]';

function shouldLog() {
  const env = typeof process !== 'undefined' ? process.env.NODE_ENV : undefined;
  return env !== 'production' && env !== 'test';
}

function write(method, args) {
  if (!shouldLog()) return;

  const consoleMethod = console[method] || console.log;
  consoleMethod(APP_PREFIX, ...args);
}

export function log(...args) {
  write('log', args);
}

export function warn(...args) {
  write('warn', args);
}

export function error(...args) {
  write('error', args);
}
