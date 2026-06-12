import { pointsForTransaction, groupByCustomerAndMonth, enrichTransactionsWithPoints } from '../utils/rewardCalculations';

test('pointsForTransaction basic', () => {
  expect(pointsForTransaction(120)).toBe(90);
  expect(pointsForTransaction(100)).toBe(50);
  expect(pointsForTransaction(50)).toBe(0);
  expect(pointsForTransaction(75.4)).toBe(25);
});

test('handles decimals by flooring for edge cases', () => {
  // check a few decimal scenarios
  expect(pointsForTransaction(180)).toBe((80 * 2) + 50); // 180 -> floor 180
  expect(pointsForTransaction(180.3)).toBe((80 * 2) + 50);
  expect(pointsForTransaction(180.56)).toBe((80 * 2) + 50);
  expect(pointsForTransaction(180.99)).toBe((80 * 2) + 50);
});

test('grouping and enrichment across months and years', () => {
  const tx = [
    { id: 'a', customerId: 'c1', firstName: 'A', lastName: 'One', date: '12-01-2023', price: 120 },
    { id: 'b', customerId: 'c1', firstName: 'A', lastName: 'One', date: '01-05-2024', price: 60 }
  ];
  const enriched = enrichTransactionsWithPoints(tx);
  const grouped = groupByCustomerAndMonth(enriched);
  expect(grouped.c1.total).toBe(90 + 10);
});

test('pointsForTransaction edge and string inputs', () => {
  // non-number or NaN
  expect(pointsForTransaction(NaN)).toBe(0);
  expect(pointsForTransaction(-10)).toBe(0);

  // boundary values
  expect(pointsForTransaction(50)).toBe(0);
  expect(pointsForTransaction(51)).toBe(1);
  expect(pointsForTransaction(100)).toBe(50);
  expect(pointsForTransaction(101)).toBe(52);
  expect(pointsForTransaction(200)).toBe(250);
});

test('enrich handles string prices and grouping arrays output', () => {
  const tx = [
    { id: 't1', customerId: 'c2', firstName: 'B', lastName: 'Two', date: '04-02-2026', price: '120.9' },
    { id: 't2', customerId: 'c2', firstName: 'B', lastName: 'Two', date: '04-15-2026', price: 80 }
  ];
  const enriched = enrichTransactionsWithPoints(tx);
  // first should floor to 120 -> 90 points
  expect(enriched[0].points).toBe(90);
  // second 80 -> 30 points
  expect(enriched[1].points).toBe(30);

  const grouped = groupByCustomerAndMonth(enriched);
  const monthKey = Object.keys(grouped.c2.totals)[0];
  expect(grouped.c2.totals[monthKey]).toBe(120);
});

test('totalRewardsArray sorts by descending points', () => {
  const sample = {
    a: { customerId: 'a', firstName: 'A', lastName: '', name: 'A', totals: {}, total: 100 },
    b: { customerId: 'b', firstName: 'B', lastName: '', name: 'B', totals: {}, total: 250 },
    c: { customerId: 'c', firstName: 'C', lastName: '', name: 'C', totals: {}, total: 50 }
  };
  const { totalRewardsArray } = require('../utils/rewardCalculations');
  const totals = totalRewardsArray(sample);
  expect(totals.map((r) => r.customerId)).toEqual(['b', 'a', 'c']);
});
