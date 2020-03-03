import React, { useCallback } from 'react';
import StyledOcticon from '../StyledOcticon';
import { Flex, FlexItem } from '../../../components/ui/Flex/';
import { Plus } from '@primer/octicons-react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { setSelection } from '../../../reducers/selectionSlice';
import { EventDates } from '../EventDates';

const BirthEvent: React.FC<any> = function({
  actor,
  event,
  icon,
  color,
  highlight,
  place
}) {
  const dispatch = useDispatch();
  //   const highlights = useSelector(highlightsAsMap);
  const handleSelection = useCallback(() => {
    dispatch(setSelection({ id: event.id, kind: 'Event' }));
  }, [dispatch, event.id]);

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('sip-info--event', 'pb1', 'br2', {
        b: event.selected,
        'o-50': event.filtered,
        'bg-light-gray': highlight
      })}
      onClick={handleSelection}
    >
      <span className="ph2">
        {icon && (
          <StyledOcticon
            color={color ? color(event.kind) : 'black'}
            icon={Plus}
            width={16}
            height={16}
          />
        )}
      </span>
      <FlexItem auto>
        Naissance
        {place
          ? ` de ${actor.label}`
          : event.localisation
          ? ` à ${event.localisation.label}`
          : ''}
      </FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export default BirthEvent;
