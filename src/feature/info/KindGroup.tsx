import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { AnyEvent, Datation } from '../../data';
import { Flex, FlexItem } from '../../components/ui/Flex';
import _ from 'lodash';
import Octicon, { ChevronUp, ChevronDown } from '@primer/octicons-react';
import { ThumbnailEventInfo } from './EventInfo';
import { EventDates } from './EventDates';
import { useSelector, useDispatch } from 'react-redux';
import { StyledOcticon } from './StyledOcticon';
import styled from 'styled-components/macro';
import { selectSwitchKindColor } from '../../selectors/switch';
import getEventIcon from './event/getEventIcon';
import {
  setSuperHighlightThunk,
  clearSuperHighlightThunk
} from '../../thunks/highlights';

const MarginLeftDiv = styled<any>('div')`
  border-color: ${(props: any) => props.borderColor};
  margin-left: 1rem;
`;

export const KindGroup: React.FC<{
  kind: AnyEvent['kind'];
  events: AnyEvent[];
  start: Datation;
  end: Datation;
  origin: 'Actor' | 'NamedPlace';
  selected?: boolean;
  masked?: boolean;
  highlighted?: boolean;
}> = function({
  kind,
  events,
  start,
  end,
  origin,
  selected,
  masked,
  highlighted
}) {
  const color = useSelector(selectSwitchKindColor);
  const [show, setShow] = useState(false);
  const handleClick = useCallback(() => setShow(s => !s), []);
  useEffect(() => setShow(selected === true), [selected]);

  const content = getKindString(kind);

  const dispatch = useDispatch();
  const handleMouseEnter = useCallback(() => {
    dispatch(
      setSuperHighlightThunk(_.map(events, ({ id }) => ({ id, kind: 'Event' })))
    );
  }, [dispatch, events]);

  const handleMouseLeave = useCallback(() => {
    dispatch(clearSuperHighlightThunk());
  }, [dispatch]);

  return (
    <div className="pv1">
      <Flex
        justify="between"
        items="center"
        className={classnames('sip-info--event', {
          b: selected,
          'o-50': masked,
          'bg-light-gray': highlighted
        })}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="ph2">
          <StyledOcticon
            iconColor={color ? color(kind) : 'black'}
            icon={getEventIcon(kind)}
            width={16}
            height={16}
          />
        </span>
        <FlexItem auto>
          {events.length} {content}
        </FlexItem>
        <EventDates dates={[start, end]} />
        <Octicon
          className="ma1 flex-shrink-0"
          verticalAlign="text-bottom"
          icon={show ? ChevronUp : ChevronDown}
          ariaLabel={show ? 'Réduire' : 'Etendre'}
        />
      </Flex>
      {show && (
        <MarginLeftDiv
          className="bl bw1 pt1"
          borderColor={color ? color(kind) : 'grey'}
        >
          {_.map(events, e => (
            <ThumbnailEventInfo
              key={e.id}
              event={e}
              origin={origin}
              icon={false}
            />
          ))}
        </MarginLeftDiv>
      )}
    </div>
  );
};

export default KindGroup;
function getKindString(kind: string) {
  switch (kind) {
    case 'Birth':
      return 'Naissances';

    case 'Death':
      return 'Décès';

    case 'Education':
      return 'Enseignements';

    case 'ObtainQualification':
      return 'Obtention de qualités';

    case 'PassageExamen':
      return 'Evaluations';

    case 'Retirement':
      return 'Départs en retraite';

    case 'SuspensionActivity':
      return "Suspensions d'activités";

    default: {
      return 'Inconnue';
    }
  }
}