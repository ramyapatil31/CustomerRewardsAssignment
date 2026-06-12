import PropTypes from 'prop-types';
import CommonTable from './CommonTable';

void CommonTable;

export default function MonthlyRewards({ rows }) {
  const columns = ['customerId', 'name', 'month', 'year', 'points'];
  return <CommonTable data={rows} columns={columns} caption="Monthly Rewards" />;
}

MonthlyRewards.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string,
      month: PropTypes.string,
      year: PropTypes.string,
      points: PropTypes.number
    })
  ).isRequired
};
