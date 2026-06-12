import { useEffect, useState } from 'react';
import parse from 'date-fns/parse';
import endOfMonth from 'date-fns/endOfMonth';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { fetchTransactions } from './services/api';
import { log } from './utils/logger';
import {
  enrichTransactionsWithPoints,
  groupByCustomerAndMonth,
  monthlyRewardsArray,
  totalRewardsArray
} from './utils/rewardCalculations';
import LoadingSpinner from './components/LoadingSpinner';
// eslint-disable-next-line no-unused-vars
import ErrorPopup from './components/ErrorPopup';
import Transactions from './components/Transactions';
import MonthlyRewards from './components/MonthlyRewards';
import TotalRewards from './components/TotalRewards';

void LoadingSpinner;
void Transactions;
void MonthlyRewards;
void TotalRewards;

export default function App() {
  const [state, setState] = useState({ loading: true, error: null, transactions: [] });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [appliedRange, setAppliedRange] = useState({ from: null, to: null });

  useEffect(() => {
    let mounted = true;
    fetchTransactions()
      .then((res) => {
        if (!mounted) return;
        if (!res.ok) throw new Error('Failed to fetch');
        const enriched = enrichTransactionsWithPoints(res.data);
        // determine most recent transaction month
        const parsedDates = enriched.map((t) => parse(String(t.date), 'MM-dd-yyyy', new Date())).filter(Boolean);
        const latest = parsedDates.reduce((acc, d) => (acc && acc > d ? acc : d), parsedDates[0]);
        const end = endOfMonth(latest || new Date());
        // prepopulate picker to last 90 days
        const ninetyStart = new Date(end);
        ninetyStart.setDate(ninetyStart.getDate() - 89);
        setDateFrom(format(ninetyStart, 'yyyy-MM-dd'));
        setDateTo(format(end, 'yyyy-MM-dd'));
        // default displayed range is the past 90 days ending at most-recent month-end
        setAppliedRange({ from: ninetyStart, to: end });
        setState({ loading: false, error: null, transactions: enriched });
      })
      .catch((err) => {
        log('fetch error', err.message);
        if (mounted) setState({ loading: false, error: err.message, transactions: [] });
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) return <LoadingSpinner />;

  // apply date filter
  const fromDate = appliedRange.from;
  const toDate = appliedRange.to;
  const filtered = state.transactions.filter((t) => {
    const d = parse(String(t.date), 'MM-dd-yyyy', new Date());
    if (!fromDate || !toDate || !d) return true;
    return d >= fromDate && d <= toDate;
  });
  const grouped = groupByCustomerAndMonth(filtered);
  const monthly = monthlyRewardsArray(grouped);
  const totals = totalRewardsArray(grouped);

  return (
    <div>
      {state.error && (
        <ErrorPopup
          message={state.error}
          onClose={() => setState((s) => ({ ...s, error: null }))}
        />
      )}
      <div className="header">
        <h1>Rewards Summary</h1>
      </div>

      <h2>Monthly Rewards</h2>
      <MonthlyRewards rows={monthly} />

      <h2>Total Rewards</h2>
      <TotalRewards totals={totals} />

      <h2>Transactions</h2>

      <div className="date-filter" role="region" aria-label="Transaction date filter">
        <div className="date-filter__row">
          <label className="date-filter__label">
            From
            <input
              aria-label="From date"
              className="date-filter__input"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>

          <label className="date-filter__label">
            To
            <input
              aria-label="To date"
              className="date-filter__input"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>

          <button
            className="btn btn--primary date-filter__button"
            onClick={() => {
              const from = parse(dateFrom, 'yyyy-MM-dd', new Date());
              const to = parse(dateTo, 'yyyy-MM-dd', new Date());
              const days = differenceInCalendarDays(to, from) + 1;
              if (days > 90) {
                const err = new Error('Date range cannot exceed 90 days');
                setState((s) => ({ ...s, error: err }));
                return;
              }
              setState((s) => ({ ...s, error: null }));
              setAppliedRange({ from, to });
            }}
          >
            Apply
          </button>
        </div>
      </div>

      <Transactions items={filtered.sort((a, b) => {
        const da = parse(String(a.date), 'MM-dd-yyyy', new Date());
        const db = parse(String(b.date), 'MM-dd-yyyy', new Date());
        return da - db;
      })} />
    </div>
  );
}
