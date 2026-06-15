import PropTypes from 'prop-types';
import CommonTable from './CommonTable';
import format from 'date-fns/format';

export default function TotalRewards({ totals, range }) {
  const columns = ['customerId', 'name', 'points'];
  return (
    <div>
      {range && range.from && range.to && (
        <div className="range-note">Showing {format(range.from, 'yyyy-MM-dd')} — {format(range.to, 'yyyy-MM-dd')}</div>
      )}
      <CommonTable data={totals} columns={columns} caption="Total Rewards" />
    </div>
  );
}

TotalRewards.propTypes = {
  totals: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string,
      points: PropTypes.number
    })
  ).isRequired,
  range: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  })
};
