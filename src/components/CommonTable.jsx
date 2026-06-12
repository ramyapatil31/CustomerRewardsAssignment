import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';
import format from 'date-fns/format';
// eslint-disable-next-line no-unused-vars
import ErrorPopup from './ErrorPopup';

function isDateStringMMDDYYYY(v) {
  return typeof v === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(v);
}

function formatCell(value, key) {
  if (value == null) return '';
  if (isDateStringMMDDYYYY(value)) {
    try {
      const d = parse(value, 'MM-dd-yyyy', new Date());
      if (isValid(d)) return format(d, 'MM-dd-yyyy');
      return value;
    } catch (e) {
      return value;
    }
  }
  if (typeof value === 'number') {
    const lowerKey = String(key || '').toLowerCase();
    const currencyKeys = ['price', 'amount', 'cost', 'balance'];
    const isCurrency = currencyKeys.some((k) => lowerKey.includes(k));
    if (isCurrency) return `$${value.toFixed(2)}`;
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  // display month names when the column is `month` and value is numeric or zero-padded
  if (key && String(key).toLowerCase() === 'month') {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const n = Number(value);
    if (!Number.isNaN(n) && n >= 1 && n <= 12) return monthNames[n - 1];
  }
  return String(value);
}

function prettifyHeader(key) {
  if (!key) return '';
  let s = String(key).replace(/[_-]+/g, ' ');
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return s
    .split(' ')
    .map((w) => (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(' ');
}

export default function CommonTable({ data, columns, caption, showCaption = false, pageSize = 10 }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data</div>;
  }

  const keys = columns && columns.length ? columns : Object.keys(data[0]);

  const [page, setPage] = useState(1);

    function matchesQuery() {
      return true;
    }

    const { filtered, filterError } = useMemo(() => {
      let _error = null;
      const f = data.filter((r) => {
        try {
          return matchesQuery(r);
        } catch (e) {
          _error = e;
          return false;
        }
      });
      return { filtered: f, filterError: _error };
    }, [data]);

    const [localError, setLocalError] = useState(null);
    useEffect(() => {
      if (filterError) setLocalError(filterError);
    }, [filterError]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="table-responsive">
      {localError && (
        <ErrorPopup message={localError} onClose={() => setLocalError(null)} />
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <div style={{ alignSelf: 'center' }}>
          <small>{filtered.length} rows</small>
        </div>
      </div>

      <table className="table" aria-label={caption || 'table'}>
        {showCaption && caption && (
          <caption style={{ textAlign: 'left', padding: '8px 12px' }}>{caption}</caption>
        )}
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k}>{prettifyHeader(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {current.map((row) => {
            const rowKey = row.id ?? (row.customerId ? `${row.customerId}-${row.date ?? ''}-${row.product ?? ''}` : JSON.stringify(row));
            return (
              <tr key={rowKey}>
                {keys.map((k) => (
                  <td key={k}>{formatCell(row[k], k)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>
          {'<<'}
        </button>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          {'<'}
        </button>
        <span style={{ alignSelf: 'center' }}>
          Page {page} / {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          {'>'}
        </button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
          {'>>'}
        </button>
      </div>
    </div>
  );
}

CommonTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array,
  caption: PropTypes.string,
  showCaption: PropTypes.bool
};
