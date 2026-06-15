const customers = [
  { id: 'c1', firstName: 'Alice', lastName: 'Johnson' },
  { id: 'c2', firstName: 'Bob', lastName: 'Smith' },
  { id: 'c3', firstName: 'Carol', lastName: 'Danvers' },
  { id: 'c4', firstName: 'Dan', lastName: 'Brown' },
  { id: 'c5', firstName: 'Eve', lastName: 'Martinez' },
  { id: 'c6', firstName: 'Frank', lastName: 'Wilson' },
  { id: 'c7', firstName: 'Grace', lastName: 'Lee' },
  { id: 'c8', firstName: 'Henry', lastName: 'Ng' },
  { id: 'c9', firstName: 'Ivy', lastName: 'Chen' },
  { id: 'c10', firstName: 'Jack', lastName: 'Garcia' }
];

const products = ['Coffee Maker', 'Blender', 'Toaster', 'Mixer', 'Air Fryer', 'Espresso', 'Kettle', 'Grinder', 'Juicer', 'Oven'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatMMDDYYYY(d) {
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`;
}

// Dates are formatted as MM-DD-YYYY to match parsing in the app.
const start = new Date(2026, 3, 1); // April 1, 2026
const end = new Date(); // dynamic end date (current date)
const dayMs = 24 * 60 * 60 * 1000;
const totalDays = Math.max(1, Math.round((end - start) / dayMs) + 1);

// Create multiple transactions per day but keep total moderate (~300 records)
const perDay = 4;
const data = [];
let idx = 1;
for (let day = 0; day < totalDays; day += 1) {
  const dayDate = new Date(start.getTime() + day * dayMs);
  for (let k = 0; k < perDay; k += 1) {
    const cust = customers[(day * perDay + k) % customers.length];
    const product = products[(day * perDay + k) % products.length];
    const priceWhole = 10 + ((day * perDay + k) * 37) % 300;
    const priceCents = ((day * perDay + k) * 13) % 100;
    const price = Number((priceWhole + priceCents / 100).toFixed(2));
    data.push({
      id: `t${idx}`,
      customerId: cust.id,
      firstName: cust.firstName,
      lastName: cust.lastName,
      date: formatMMDDYYYY(dayDate),
      product,
      price
    });
    idx += 1;
  }
}

export default data;
