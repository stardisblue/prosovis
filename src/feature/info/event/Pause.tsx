import React from 'react';
import { Icon } from '@primer/octicons-react';

const Pause: Icon<16, 16> = function() {
  return (
    <path
      fillRule="evenodd"
      d="M4,2 L7,2 L7,14 L4,14 Z M9,2 L12,2 L12,14 L9,14 Z M9,2"
    />
  );
};

Pause.size = [16, 16];

export default Pause;
