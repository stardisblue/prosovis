import React from 'react';
import { AnyEvent } from '../../data';
import _ from 'lodash';
export function DetailsMenuEvents({ events }: { events: AnyEvent[] }) {
  const grouped = _(events)
    .sortBy('datation[0].clean_date')
    .transform((acc, curr) => {
      const prev = _.last(acc);
      if (prev?.kind === curr.kind) {
        prev.events.push(curr);
      } else {
        acc.push({ kind: curr.kind, events: [curr] });
      }
    }, [] as { kind: string; events: AnyEvent[] }[])
    .value();
  return (
    <div>
      {_.map(grouped, ({ kind, events }) => (
        <DetailsMenuEvent key={events[0].id} kind={kind} events={events} />
      ))}
    </div>
  );
}
function DetailsMenuEvent({
  kind,
  events,
}: {
  kind: string;
  events: AnyEvent[];
}) {
  return (
    <div>
      {events.length} x {kind}
    </div>
  );
}
