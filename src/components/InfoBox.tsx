import React, { useContext } from 'react';
import _ from 'lodash';
import { Datation, Actor } from '../models';
import { SiprojurisContext } from '../SiprojurisContext';
import { ActorInfoBox } from './ActorInfoBox';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .sortBy('clean_date')
    .map(date => date.value)
    .join(' - ');
}

export const InfoBox: React.FC = function() {
  const context = useContext(SiprojurisContext);
  return (
    <div>
      {context.selected && context.selected.kind === 'Actor' && (
        <ActorInfoBox actor={context.selected} />
      )}
    </div>
  );
};
