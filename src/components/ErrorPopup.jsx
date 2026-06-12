import PropTypes from 'prop-types';

export default function ErrorPopup({ message, onClose }) {
  if (!message) return null;
  const text = message && typeof message === 'object' && message.message ? message.message : message;
  return (
    <div className="error-popup" role="alert" aria-live="assertive">
      <div className="error-popup__card">
        <div className="error-popup__title">Error</div>
        <div className="error-popup__message">{text}</div>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button className="btn" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

ErrorPopup.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]),
  onClose: PropTypes.func.isRequired
};
