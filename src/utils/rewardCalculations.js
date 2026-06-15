import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';

// Utility: round down decimal price values to integer dollars
function floorToInt(value) {
  return Math.floor(value);
}

// Calculate reward points for a single transaction price.
// Rules: 1 point per dollar over $50, plus 2 points per dollar over $100.
// Decimals are floored per the assignment requirements.
export function pointsForTransaction(price) {
  if (typeof price !== 'number' || Number.isNaN(price)) return 0;
  const p = floorToInt(price);
  let points = 0;
  if (p > 100) {
    points += (p - 100) * 2;
    points += 50; // points for dollars between 51..100
  } else if (p > 50) {
    points += p - 50;
  }
  return points;
}

// Add a `points` field to each transaction (pure function).
export function enrichTransactionsWithPoints(transactions) {
  return transactions.map((t) => ({ ...t, points: pointsForTransaction(Number(t.price)) }));
}

// Group transactions by `customerId` and month (YYYY-MM key).
// Result shape: { customerId: { customerId, firstName, lastName, name, totals: { 'YYYY-MM': points }, total } }
export function groupByCustomerAndMonth(transactions) {
  return transactions.reduce((acc, t) => {
    const date = parse(String(t.date), 'MM-dd-yyyy', new Date());
    if (!isValid(date)) return acc;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    if (!acc[t.customerId]) {
      acc[t.customerId] = {
        customerId: t.customerId,
        firstName: t.firstName || '',
        lastName: t.lastName || '',
        name: `${t.firstName || ''} ${t.lastName || ''}`.trim(),
        totals: {},
        total: 0
      };
    }
    const cust = acc[t.customerId];
    // accumulate monthly totals and overall total
    cust.totals[key] = (cust.totals[key] || 0) + t.points;
    cust.total += t.points;
    return acc;
  }, {});
}

export function monthlyRewardsArray(grouped) {
  const rows = [];
  Object.values(grouped).forEach((c) => {
    Object.keys(c.totals)
      .sort()
      .forEach((key) => {
        const [year, month] = key.split('-');
        rows.push({
          customerId: c.customerId,
          firstName: c.firstName,
          lastName: c.lastName,
          name: c.name,
          month,
          year,
          points: c.totals[key]
        });
      });
  });
  return rows.sort((a, b) => (a.year + a.month).localeCompare(b.year + b.month));
}

export function totalRewardsArray(grouped) {
  return Object.values(grouped)
    .map((c) => ({ customerId: c.customerId, firstName: c.firstName, lastName: c.lastName, name: c.name, points: c.total }))
    .sort((a, b) => b.points - a.points);
}
