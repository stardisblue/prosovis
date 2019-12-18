import React, { useContext } from 'react';
import _ from 'lodash';
import { Datation, isActor } from '../models';
import { SiprojurisContext } from '../SiprojurisContext';
import { ActorInfoBox } from './ActorInfoBox';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .sortBy('clean_date')
    .map(date => date.value)
    .join(' - ');
}

export const SiprojurisInformation: React.FC = function() {
  const context = useContext(SiprojurisContext);
  return (
    <div>
      {context.selected && isActor(context.selected) && (
        <ActorInfoBox actor={context.selected} />
      )}
    </div>
  );
};
