import parse from 'date-fns/parse';

function floorToInt(value) {
  return Math.floor(value);
}

export function pointsForTransaction(price) {
  if (typeof price !== 'number' || Number.isNaN(price)) return 0;
  const p = floorToInt(price);
  let points = 0;
  if (p > 100) {
    points += (p - 100) * 2;
    points += 50;
  } else if (p > 50) {
    points += p - 50;
  }
  return points;
}

export function enrichTransactionsWithPoints(transactions) {
  return transactions.map((t) => ({ ...t, points: pointsForTransaction(Number(t.price)) }));
}

export function groupByCustomerAndMonth(transactions) {
  return transactions.reduce((acc, t) => {
    const date = parse(String(t.date), 'MM-dd-yyyy', new Date());
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
