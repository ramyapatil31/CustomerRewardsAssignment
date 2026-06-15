import sampleData from './sampleData.js';

export async function fetchTransactions() {
  //fetching sample data
  if (typeof fetch === 'function') {
    try {
      const res = await fetch('/sample-data.json');
      if (res.ok) {
        const data = await res.json();
        return { ok: true, data };
      }
      // if response not ok, fall back to bundled data
    } catch (e) {
      // network/fetch not available or failed — fall back to bundled sampleData
    }
  }

  // Fallback: return bundled sample data
  return { ok: true, data: sampleData };
}
