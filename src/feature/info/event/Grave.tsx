import React from 'react';
import { Icon } from '@primer/octicons-react';

const Grave: Icon = function ({
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
        d="M12.8,5.6c0-3.1-2.5-5.6-5.6-5.6S1.6,2.5,1.6,5.6v7.2c-0.9,0-1.6,0.7-1.6,1.6V16l0,0h14.4l0,0v-1.6c0-0.9-0.7-1.6-1.6-1.6
	V5.6z M10.4,9.6H4V8h6.4C10.4,8,10.4,9.6,10.4,9.6z M10.4,6.4H4V4.8h6.4C10.4,4.8,10.4,6.4,10.4,6.4z"
      />
    </svg>
  );
};

export default Grave;
