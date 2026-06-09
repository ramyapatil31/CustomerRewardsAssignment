import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorDisplay({ message }) {
  return <div className="error">Error: {message}</div>;
}

ErrorDisplay.propTypes = { message: PropTypes.string.isRequired };
