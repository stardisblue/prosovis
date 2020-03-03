import { X } from '@primer/octicons-react';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Flex, FlexItem } from '../../../components/ui/Flex';
import { setSelection } from '../../../reducers/selectionSlice';
import { EventDates } from '../EventDates';
import StyledOcticon from '../StyledOcticon';

const DeathEvent: React.FC<any> = function({
  actor,
  color,
  event,
  grayed,
  highlighted,
  icon,
  place,
  selected
}) {
  const dispatch = useDispatch();
  const handleSelection = useCallback(() => {
    dispatch(setSelection({ id: event.id, kind: 'Event' }));
  }, [dispatch, event.id]);

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('sip-info--event', 'pb1', 'br2', {
        b: selected,
        'o-50': grayed,
        'bg-light-gray': highlighted // highlights[event.id]
      })}
      onClick={handleSelection}
    >
      <span className="ph2">
        {icon && (
          <StyledOcticon
            color={color ? color(event.kind) : 'black'}
            icon={X}
            width={16}
            height={16}
          />
        )}
      </span>
      <FlexItem auto>
        Décès
        {place
          ? ` de ${actor.label}`
          : event.localisation
          ? ` à ${event.localisation.label}`
          : null}
      </FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export default DeathEvent;
