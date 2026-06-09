import React from 'react';
import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

export default function MonthlyRewards({ rows }) {
  const columns = ['customerId', 'name', 'month', 'year', 'points'];
  return <CommonTable data={rows} columns={columns} caption="Monthly Rewards" />;
}

MonthlyRewards.propTypes = { rows: PropTypes.array.isRequired };
