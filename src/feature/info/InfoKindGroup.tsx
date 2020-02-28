import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { AnyEvent, Datation } from '../../data';
import { Flex, FlexItem } from '../../components/ui/Flex';
import _ from 'lodash';
import Octicon, {
  MortarBoard,
  X as XIcon,
  Question,
  Icon,
  Book,
  Bookmark,
  Home,
  Telescope,
  ChevronUp,
  ChevronDown,
  Check
} from '@primer/octicons-react';
import { EventDates, MemoEventInfo } from './EventInfo';
import { useSelector } from 'react-redux';
import { StyledOcticon } from './StyledOcticon';
import styled from 'styled-components';
import { selectSwitchKindColor } from '../../selectors/switch';

const MarginLeftDiv = styled<any>('div')`
  border-color: ${(props: any) => props.borderColor};
  margin-left: 1rem;
`;

export const InfoKindGroup: React.FC<{
  kind: AnyEvent['kind'];
  events: AnyEvent | AnyEvent[];
  start: Datation;
  end: Datation;
  origin: 'Actor' | 'NamedPlace';
  selected?: boolean;
  filtered?: boolean;
}> = function({ kind, events, start, end, origin, selected, filtered }) {
  const color = useSelector(selectSwitchKindColor);
  const [show, setShow] = useState(false);
  const handleClick = useCallback(() => setShow(s => !s), []);
  useEffect(() => setShow(selected === true), [selected]);
  let icon: Icon<number, number>;
  let content: string = kind;
  switch (kind) {
    case 'Birth':
      icon = Check;
      content = 'Naissances';
      break;
    case 'Death':
      icon = XIcon;
      content = 'Décès';
      break;
    case 'Education':
      icon = Book;
      content = 'Enseignements';
      break;
    case 'ObtainQualification':
      icon = MortarBoard;
      content = 'Obtention de qualités';
      break;
    case 'PassageExamen':
      icon = Bookmark;
      content = 'Evaluations';
      break;
    case 'Retirement':
      icon = Home;
      content = 'Départs en retraite';
      break;
    case 'SuspensionActivity':
      icon = Telescope;
      content = "Suspensions d'activités";
      break;
    default: {
      icon = Question;
      content = 'Inconnue';
    }
  }
  if (_.isArray(events))
    return (
      <div className="pv1">
        <Flex
          justify="between"
          items="center"
          className={classnames('sip-info--event', {
            b: selected,
            'o-50': filtered
          })}
          onClick={handleClick}
        >
          <span className="ph2">
            <StyledOcticon
              color={color ? color(kind) : 'black'}
              icon={icon}
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
              <MemoEventInfo
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
  else return <MemoEventInfo event={events} origin={origin} />;
};
