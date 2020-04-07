import React from 'react';

import VisTimeline from './VisTimeline';
import SipTimelineHeader from './SipTimelineHeader';

const SiprojurisTimeline: React.FC<{ className?: string }> = function ({
  className,
}) {
  return (
    <div className={className}>
      <SipTimelineHeader />
      <VisTimeline />
    </div>
  );
};

export default SiprojurisTimeline;
