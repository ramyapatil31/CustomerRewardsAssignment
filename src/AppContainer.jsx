import { useEffect, useMemo, useState } from 'react';
import parse from 'date-fns/parse';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import isValid from 'date-fns/isValid';
import isAfter from 'date-fns/isAfter';
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
import ErrorPopup from './components/ErrorPopup';
import Transactions from './components/Transactions';
import MonthlyRewards from './components/MonthlyRewards';
import TotalRewards from './components/TotalRewards';

export default function AppContainer() {
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
        // Use today's date as the end of the filter window and start 90 days earlier.
        const end = new Date();
        const ninetyStart = new Date(end);
        ninetyStart.setDate(ninetyStart.getDate() - 89);
        setDateFrom(format(ninetyStart, 'yyyy-MM-dd'));
        setDateTo(format(end, 'yyyy-MM-dd'));
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
  function validateDateStrings(fromStr, toStr) {
    if (!fromStr || !toStr) return { valid: false, message: 'Please select both From and To dates' };
    const from = parse(String(fromStr), 'yyyy-MM-dd', new Date());
    const to = parse(String(toStr), 'yyyy-MM-dd', new Date());
    if (!isValid(from) || !isValid(to)) return { valid: false, message: 'One or both dates are invalid' };
    const today = new Date();
    if (isAfter(from, today) || isAfter(to, today)) return { valid: false, message: 'Dates cannot be in the future' };
    if (isAfter(from, to)) return { valid: false, message: 'From date must be on or before To date' };
    const days = differenceInCalendarDays(to, from) + 1;
    if (days > 90) return { valid: false, message: 'Date range cannot exceed 90 days' };
    return { valid: true, from, to };
  }

  const fromDate = appliedRange.from;
  const toDate = appliedRange.to;
  const filtered = state.transactions.filter((t) => {
    const d = parse(String(t.date), 'MM-dd-yyyy', new Date());
    if (!isValid(d)) return false;
    if (!fromDate || !toDate) return true;
    const ts = d.getTime();
    return ts >= fromDate.getTime() && ts <= toDate.getTime();
  });
  const grouped = groupByCustomerAndMonth(filtered);
  const monthly = monthlyRewardsArray(grouped);
  const totals = totalRewardsArray(grouped);

  const sortedTransactions = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = parse(String(a.date), 'MM-dd-yyyy', new Date());
      const db = parse(String(b.date), 'MM-dd-yyyy', new Date());
      return da - db;
    });
  }, [filtered]);

  if (state.loading) return <LoadingSpinner />;

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

          <div className="date-filter" role="region" aria-label="Transaction date filter">
        <div className="date-filter__row">
          <label className="date-filter__label">
            From
            <input
              aria-label="From date"
              className="date-filter__input"
              type="date"
              value={dateFrom}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setState((s) => ({ ...s, error: null }));
              }}
            />
          </label>

          <label className="date-filter__label">
            To
            <input
              aria-label="To date"
              className="date-filter__input"
              type="date"
              value={dateTo}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => {
                setDateTo(e.target.value);
                setState((s) => ({ ...s, error: null }));
              }}
            />
          </label>

          <button
            className="btn btn--primary date-filter__button"
            onClick={() => {
                const v = validateDateStrings(dateFrom, dateTo);
                if (!v.valid) {
                  setState((s) => ({ ...s, error: v.message }));
                  return;
                }
                setState((s) => ({ ...s, error: null }));
                setAppliedRange({ from: v.from, to: v.to });
              }}
          >
            Apply
          </button>
        </div>
        </div>

        <h2>Monthly Rewards</h2>
        <MonthlyRewards rows={monthly} range={appliedRange} />

        <h2>Total Rewards</h2>
        <TotalRewards totals={totals} range={appliedRange} />

        <h2>Transactions</h2>

        <Transactions items={sortedTransactions} />
    </div>
  );
}
