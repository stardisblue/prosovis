import React from 'react';
// import _ from 'lodash';
import { Ressource, AnyEvent } from '../models';

export const SiprojurisInformationItem: React.FC<{
  group: Ressource;
  events: AnyEvent[];
}> = React.memo(function({ group, events }) {
  return (
    <div className="sip-info-item">
      <div className="sip-info-item-title">
        {group ? group.label : 'Inconnu'}
      </div>
      {/* <div className="sip-info-item-events">
        {_.map(events, e => (
          <div className="event">{e.label}</div>
        ))}
      </div> */}
    </div>
  );
});
