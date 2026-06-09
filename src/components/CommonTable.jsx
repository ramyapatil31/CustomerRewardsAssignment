import React from 'react';
import PropTypes from 'prop-types';

function isIsoDateString(v) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v);
}

function formatCell(value) {
  if (value == null) return '';
  if (typeof value === 'number') return value;
  if (isIsoDateString(value)) {
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  }
  return String(value);
}

function prettifyHeader(key) {
  if (!key) return '';
  // replace underscores/dashes with spaces
  let s = String(key).replace(/[_-]+/g, ' ');
  // insert spaces before camelCase capitals
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  // split and title-case words
  return s
    .split(' ')
    .map((w) => (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(' ');
}

export default function CommonTable({ data, columns, caption, showCaption = false }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data</div>;
  }

  const keys = columns && columns.length ? columns : Object.keys(data[0]);

  return (
    <div className="table-responsive">
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
          {data.map((row, i) => (
            <tr key={i}>
              {keys.map((k) => (
                <td key={k}>{formatCell(row[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

CommonTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array,
  caption: PropTypes.string,
  showCaption: PropTypes.bool
};
