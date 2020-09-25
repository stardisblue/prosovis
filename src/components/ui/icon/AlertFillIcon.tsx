import React from 'react';
import { Icon } from '@primer/octicons-react';

const AlertFillIcon: Icon = function ({
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
        d="M 6.457 1.047 c 0.659 -1.234 2.427 -1.234 3.086 0 l 6.082 11.378 A 1.75 1.75 0 0 1 14.082 15 H 1.918 a 1.75 1.75 0 0 1 -1.543 -2.575 L 6.457 1.047 z M 9 11 a 1 1 0 0 0 -2 0 a 1 1 0 0 0 2 0 z m -0.25 -5.25 a 0.75 0.75 0 0 0 -1.5 0 v 2.5 a 0.75 0.75 0 0 0 1.5 0 v -2.5 z"
      />
    </svg>
  );
};

export default AlertFillIcon;
