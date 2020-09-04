import React, { useMemo } from 'react';
import classnames from 'classnames';
import { AnyEvent } from '../../data/typings';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { SelectedEvent } from './models';
import { useSelector } from 'react-redux';
import { selectSwitchKindColor } from '../../selectors/switch';
import { EventDates } from './EventDates';

import getEventInfo from './event/getEventInfo';
import getEventIcon from './event/getEventIcon';

import useHoverHighlight from '../../hooks/useHoverHighlight';
import { useClickSelect } from '../../hooks/useClick';
import { superHighlightAsMap } from '../../selectors/superHighlights';

type ThumbnailEventInfoProps<T = AnyEvent> = {
  event: SelectedEvent<T>;
  origin: 'Actor' | 'NamedPlace';
  icon?: boolean;
};

export const ThumbnailEventInfo: React.FC<ThumbnailEventInfoProps> = function ({
  event,
  origin,
}) {
  const highlights = useSelector(superHighlightAsMap);
  const dispatchable = useMemo(() => ({ id: event.id, kind: 'Event' }), [
    event.id,
  ]);

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('pb1 br2 pointer', {
        b: event.selected,
        'o-50': event.masked,
        'bg-light-gray': highlights[event.id],
      })}
      {...useClickSelect(dispatchable)}
      {...useHoverHighlight(dispatchable)}
    >
      <span className="ph2"></span>
      <FlexItem auto>{getEventInfo(event, origin === 'Actor', true)}</FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

type EventInfoProps<T = AnyEvent> = {
  event: SelectedEvent<T>;
  origin: 'Actor' | 'NamedPlace';
};

export const EventInfo: React.FC<EventInfoProps> = function ({
  event,
  origin,
}) {
  const color = useSelector(selectSwitchKindColor);
  const dispatchable = useMemo(() => ({ id: event.id, kind: 'Event' }), [
    event.id,
  ]);

  const Icon = getEventIcon(event.kind);

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('pb1 br2 pointer', {
        b: event.selected,
        'o-50': event.masked,
        'bg-light-gray': event.highlighted,
      })}
      {...useHoverHighlight(dispatchable)}
      {...useClickSelect(dispatchable)}
    >
      <span className="ph2">
        <Icon iconColor={color ? color(event.kind) : 'black'} />
      </span>
      <FlexItem auto>{getEventInfo(event, origin === 'Actor', false)}</FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export default EventInfo;
