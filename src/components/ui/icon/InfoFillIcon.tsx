import React from 'react';
import { Icon } from '@primer/octicons-react';

const InfoFillIcon: Icon = function ({
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
        d="M 8 0 a 8 8 0 1 0 0 16 a 8 8 0 0 0 0 -16 z M 6.5 7.75 A 0.75 0.75 0 0 1 7.25 7 h 1 a 0.75 0.75 0 0 1 0.75 0.75 v 2.75 h 0.25 a 0.75 0.75 0 0 1 0 1.5 h -2 a 0.75 0.75 0 0 1 0 -1.5 h 0.25 v -2 h -0.25 a 0.75 0.75 0 0 1 -0.75 -0.75 z M 8 6 a 1 1 0 0 1 0 -2 a 1 1 0 0 1 0 2 z"
      />
    </svg>
  );
};

export default InfoFillIcon;
