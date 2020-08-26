import React from 'react';

import VisTimeline from './VisTimeline';

const SiprojurisTimeline: React.FC<{ className?: string }> = function ({
  className,
}) {
  return (
    <div className={className}>
      <VisTimeline />
    </div>
  );
};

export default SiprojurisTimeline;
