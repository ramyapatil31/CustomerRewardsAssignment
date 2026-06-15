import PropTypes from 'prop-types';
import CommonTable from './CommonTable';
import format from 'date-fns/format';

export default function MonthlyRewards({ rows, range }) {
  const columns = ['customerId', 'name', 'month', 'year', 'points'];
  return (
    <div>
      {range && range.from && range.to && (
        <div className="range-note">Showing {format(range.from, 'yyyy-MM-dd')} — {format(range.to, 'yyyy-MM-dd')}</div>
      )}
      <CommonTable data={rows} columns={columns} caption="Monthly Rewards" />
    </div>
  );
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
  ).isRequired,
  range: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  })
};
