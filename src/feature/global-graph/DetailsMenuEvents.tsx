import React from 'react';
import { AnyEvent } from '../../data';
import _ from 'lodash';
export function DetailsMenuEvents({ events }: { events: AnyEvent[] }) {
  return <div>{_.map(events, 'label')}</div>;
}
