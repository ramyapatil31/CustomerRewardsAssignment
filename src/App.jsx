import React, { useEffect, useState } from 'react';
import { fetchTransactions } from './services/api';
import { log } from './utils/logger';
import {
  enrichTransactionsWithPoints,
  groupByCustomerAndMonth,
  monthlyRewardsArray,
  totalRewardsArray
} from './utils/rewardCalculations';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Transactions from './components/Transactions';
import MonthlyRewards from './components/MonthlyRewards';
import TotalRewards from './components/TotalRewards';

export default function App() {
  const [state, setState] = useState({ loading: true, error: null, transactions: [] });

  useEffect(() => {
    let mounted = true;
    fetchTransactions()
      .then((res) => {
        if (!mounted) return;
        if (!res.ok) throw new Error('Failed to fetch');
        const enriched = enrichTransactionsWithPoints(res.data);
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
  if (state.error) return <ErrorDisplay message={state.error} />;

  const grouped = groupByCustomerAndMonth(state.transactions);
  const monthly = monthlyRewardsArray(grouped);
  const totals = totalRewardsArray(grouped);

  return (
    <div>
      <div className="header">
        <h1>Rewards Summary</h1>
        <div className="small">Simple assessment app</div>
      </div>

      <h2>Monthly Rewards</h2>
      <MonthlyRewards rows={monthly} />

      <h2>Total Rewards</h2>
      <TotalRewards totals={totals} />

      <h2>Transactions</h2>
      <Transactions items={state.transactions.sort((a, b) => new Date(a.date) - new Date(b.date))} />
    </div>
  );
}
