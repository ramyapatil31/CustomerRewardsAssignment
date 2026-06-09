import React from 'react';
import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

export default function Transactions({ items }) {
  const columns = ['id', 'name', 'date', 'product', 'price', 'points'];
  return <CommonTable data={items} columns={columns} caption="Transactions" />;
}

Transactions.propTypes = { items: PropTypes.array.isRequired };
