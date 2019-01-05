import React, { PropTypes } from 'react';

function Dialog({ children, left, top, onClose }) {
  const styles = {
    left,
    top,
  };
  return (
    <div className="transparent-screen" onClick={onClose}>
      <div className="dialog" style={styles}>
        <div className="dialog__content">{children}</div>
      </div>
    </div>
    );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Dialog;
