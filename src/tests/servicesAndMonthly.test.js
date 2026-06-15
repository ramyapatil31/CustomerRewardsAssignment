import { fetchTransactions } from '../services/api';
import sampleData from '../services/sampleData';
import { monthlyRewardsArray } from '../utils/rewardCalculations';
import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import startOfDay from 'date-fns/startOfDay';

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

test('sampleData contains dates within a recent ~3-month window', () => {
  const parsed = sampleData
    .map((t) => parse(t.date, 'MM-dd-yyyy', new Date()))
    .filter((d) => isValid(d));
  expect(parsed.length).toBeGreaterThan(0);
  const times = parsed.map((d) => d.getTime());
  const min = new Date(Math.min(...times));
  const max = new Date(Math.max(...times));
  // max should not be far in the future (allow one-day tolerance for generation/timezone differences)
  const todayStart = startOfDay(new Date());
  expect(differenceInCalendarDays(max, todayStart)).toBeLessThanOrEqual(1);
  // window should be at most 90 days
  const days = differenceInCalendarDays(max, min) + 1;
  expect(days).toBeLessThanOrEqual(90);
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
