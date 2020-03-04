import React, { useCallback } from 'react';
import classnames from 'classnames';
import { AnyEvent } from '../../data';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { SelectedEvent } from './models';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection } from '../../reducers/selectionSlice';
import { highlightsAsMap } from '../../selectors/highlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { StyledOcticon } from './StyledOcticon';
import { EventDates } from './EventDates';

import getEventInfo from './event/getEventInfo';
import getEventIcon from './event/getEventIcon';

type EventInfoProps<T = AnyEvent> = {
  event: SelectedEvent<T>;
  origin: 'Actor' | 'NamedPlace';
  icon?: boolean;
};

export const EventInfo: React.FC<EventInfoProps> = function({
  event,
  origin,
  icon = true
}) {
  const color = useSelector(selectSwitchKindColor);

  const highlights = useSelector(highlightsAsMap);

  const dispatch = useDispatch();
  const handleSelect = useCallback(() => {
    dispatch(setSelection({ id: event.id, kind: 'Event' }));
  }, [dispatch, event.id]);

  const colorIcon = icon ? (color ? color(event.kind) : 'black') : undefined;
  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('pb1', 'br2', {
        b: event.selected,
        'o-50': event.filtered,
        'bg-light-gray': highlights[event.id]
      })}
      onClick={handleSelect}
    >
      <span className="ph2">
        {colorIcon && (
          <StyledOcticon
            iconColor={colorIcon}
            icon={getEventIcon(event.kind)}
            width={16}
            height={16}
          />
        )}
      </span>
      <FlexItem auto>
        {getEventInfo(event, origin === 'Actor', showIcon)}
      </FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export const MemoEventInfo = EventInfo;
