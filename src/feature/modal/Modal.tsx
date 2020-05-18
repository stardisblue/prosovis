import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modals')!;

const Modal: React.FC = function ({ children }) {
  return ReactDOM.createPortal(children, modalRoot);
};

export default Modal;
