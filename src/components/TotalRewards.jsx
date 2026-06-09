import React from 'react';
import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

export default function TotalRewards({ totals }) {
  const columns = ['name', 'points'];
  return <CommonTable data={totals} columns={columns} caption="Total Rewards" />;
}

TotalRewards.propTypes = { totals: PropTypes.array.isRequired };
