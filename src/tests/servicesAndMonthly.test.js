import { fetchTransactions } from '../services/api';
import sampleData from '../services/sampleData';
import { monthlyRewardsArray } from '../utils/rewardCalculations';

test('fetchTransactions resolves with ok and data array', async () => {
  const res = await fetchTransactions();
  expect(res).toBeDefined();
  expect(res.ok).toBe(true);
  expect(Array.isArray(res.data)).toBe(true);
  expect(res.data.length).toBeGreaterThan(0);
  const first = res.data[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('date');
  expect(first).toHaveProperty('price');
  // date format MM-DD-YYYY
  expect(first.date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
  expect(typeof first.price).toBe('number');
});

test('sampleData contains start and end dates for three-month window', () => {
  // ensure earliest and latest expected dates exist
  const hasStart = sampleData.some((t) => t.date === '04-01-2026');
  const hasEnd = sampleData.some((t) => t.date === '06-12-2026');
  expect(hasStart).toBe(true);
  expect(hasEnd).toBe(true);
});

test('monthlyRewardsArray orders rows by year+month ascending', () => {
  const grouped = {
    c1: {
      customerId: 'c1',
      firstName: 'A',
      lastName: 'One',
      name: 'A One',
      totals: {
        '2026-06': 10,
        '2026-04': 20,
        '2025-12': 5
      },
      total: 35
    }
  };
  const rows = monthlyRewardsArray(grouped);
  // expect ascending by year+month: 2025-12, 2026-04, 2026-06
  expect(rows.map((r) => `${r.year}-${r.month}`)).toEqual(['2025-12', '2026-04', '2026-06']);
});
