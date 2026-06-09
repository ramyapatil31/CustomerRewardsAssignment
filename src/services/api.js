import sampleData from './sampleData.js';

// Simulated async fetch using a microtask (avoids setTimeout). Returns a Promise.
export function fetchTransactions() {
  return Promise.resolve().then(() => ({
    ok: true,
    data: sampleData
  }));
}
