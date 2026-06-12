import sampleData from './sampleData.js';

export function fetchTransactions() {
  return Promise.resolve().then(() => ({
    ok: true,
    data: sampleData
  }));
}
