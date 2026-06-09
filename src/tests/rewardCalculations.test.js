import { pointsForTransaction, groupByCustomerAndMonth, enrichTransactionsWithPoints } from '../utils/rewardCalculations';

test('pointsForTransaction basic', () => {
  expect(pointsForTransaction(120)).toBe(90);
  expect(pointsForTransaction(100)).toBe(50);
  expect(pointsForTransaction(50)).toBe(0);
  expect(pointsForTransaction(75.4)).toBe(25);
});

test('handles decimals by flooring', () => {
  expect(pointsForTransaction(100.4)).toBe(50);
  expect(pointsForTransaction(100.2)).toBe(50);
});

test('grouping and enrichment', () => {
  const tx = [
    { id: 'a', customerId: 'c1', name: 'A', date: '2023-12-01', price: 120 },
    { id: 'b', customerId: 'c1', name: 'A', date: '2024-01-05', price: 60 }
  ];
  const enriched = enrichTransactionsWithPoints(tx);
  const grouped = groupByCustomerAndMonth(enriched);
  expect(grouped.c1.total).toBe(90 + 10);
});
