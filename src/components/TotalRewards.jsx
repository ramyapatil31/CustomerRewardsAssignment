import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

void CommonTable;

export default function TotalRewards({ totals }) {
  const columns = ['customerId', 'name', 'points'];
  return <CommonTable data={totals} columns={columns} caption="Total Rewards" />;
}

TotalRewards.propTypes = {
  totals: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string,
      points: PropTypes.number
    })
  ).isRequired
};
