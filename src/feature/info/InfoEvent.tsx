import React from 'react';
import classnames from 'classnames';
import { SelectedAnyEvent } from './models';

export const InfoEvent: React.FC<{
  event: SelectedAnyEvent;
}> = function({ event }) {
  console.log(event);

  return (
    <div
      className={classnames('sip-info--event', {
        b: event.selected,
        'o-50': event.filtered
      })}
    >
      {event.label}
    </div>
  );
};
export const MemoInfoEvent = React.memo(InfoEvent);
