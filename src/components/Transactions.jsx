import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

void CommonTable;

export default function Transactions({ items }) {
  const columns = ['id', 'firstName', 'lastName', 'date', 'product', 'price', 'points'];
  return <CommonTable data={items} columns={columns} caption="Transactions" />;
}

Transactions.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      date: PropTypes.string.isRequired,
      product: PropTypes.string,
      price: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired
};
