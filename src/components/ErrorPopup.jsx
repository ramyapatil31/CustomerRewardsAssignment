import PropTypes from 'prop-types';

export default function ErrorPopup({ message, onClose }) {
  if (!message) return null;
  const text = message && typeof message === 'object' && message.message ? message.message : message;
  return (
    <div
      className="error-popup"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-popup-title"
      aria-describedby="error-popup-message"
    >
      <div className="error-popup__card">
        <div id="error-popup-title" className="error-popup__title">Error</div>
        <div id="error-popup-message" className="error-popup__message">{text}</div>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button className="btn" aria-label="Dismiss error message" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

ErrorPopup.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]),
  onClose: PropTypes.func.isRequired
};
