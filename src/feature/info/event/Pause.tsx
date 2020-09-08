import React from 'react';
import { Icon } from '@primer/octicons-react';

const Pause: Icon = function ({
  className = 'octicon',
  'aria-label': ariaLabel,
  verticalAlign = 'text-bottom',
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      style={{
        display: 'inline-block',
        userSelect: 'none',
        verticalAlign: verticalAlign,
      }}
      aria-label={ariaLabel}
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4,2 L7,2 L7,14 L4,14 Z M9,2 L12,2 L12,14 L9,14 Z M9,2"
      />
    </svg>
  );
};
export default Pause;
