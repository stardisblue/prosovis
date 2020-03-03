import React, { useCallback } from 'react';
import classnames from 'classnames';
import { AnyEvent } from '../../data';
import { Flex, FlexItem } from '../../components/ui/Flex';
import _ from 'lodash';
import {
  MortarBoard,
  Question,
  Icon,
  Book,
  Bookmark,
  Home,
  Telescope,
  Plus,
  X as Cross
} from '@primer/octicons-react';
import { SelectedEvent } from './models';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection } from '../../reducers/selectionSlice';
import { highlightsAsMap } from '../../selectors/highlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { StyledOcticon } from './StyledOcticon';
import { EventDates } from './EventDates';
import { getDeathInfo, getEducationInfo } from './event/utils';
import InfoEvent from './event/InfoEvent';
import InfoBirth from './event/InfoBirthEvent';

type EventInfoProps<T = AnyEvent> = {
  event: SelectedEvent<T>;
  origin: 'Actor' | 'NamedPlace';
  icon?: boolean;
};

function prefix(condition: boolean, prefix: string) {
  return function(...content: (string | null | false)[]) {
    const compacted = _(content)
      .compact()
      .join(' ');
    if (condition !== false) {
      return prefix + ' ' + compacted;
    }

    return _.upperFirst(compacted);
  };
}

export const EventInfo: React.FC<EventInfoProps> = function({
  event,
  origin,
  icon: showIcon = true
}) {
  let icon: Icon<number, number>;
  let content;
  const color = useSelector(selectSwitchKindColor);
  const { actor } = event;
  const showPlace = origin === 'NamedPlace';

  const createContent = prefix(showPlace, actor.label);

  const highlights = useSelector(highlightsAsMap);

  const dispatch = useDispatch();
  const handleSelect = useCallback(() => {
    dispatch(setSelection({ id: event.id, kind: 'Event' }));
  }, [dispatch, event.id]);

  switch (event.kind) {
    case 'Birth': {
      const colorIcon = showIcon
        ? color
          ? color(event.kind)
          : 'black'
        : undefined;
      return (
        <InfoBirth event={event} fromActor={origin === 'Actor'}>
          {(icon, content) => (
            <InfoEvent
              dates={event.datation}
              icon={icon}
              hideOrColorIcon={colorIcon}
              mask={event.filtered}
              highlight={highlights[event.id]}
              select={event.selected}
              handleSelect={handleSelect}
            >
              {content}
            </InfoEvent>
          )}
        </InfoBirth>
      );
    }
    case 'Death': {
      const colorIcon = showIcon
        ? color
          ? color(event.kind)
          : 'black'
        : undefined;
      return (
        <InfoEvent
          dates={event.datation}
          icon={Cross}
          hideOrColorIcon={colorIcon}
          mask={event.filtered}
          highlight={highlights[event.id]}
          select={event.selected}
          handleSelect={handleSelect}
        >
          {getDeathInfo(event, origin === 'Actor')}
        </InfoEvent>
      );
    }
    case 'Education': {
      const colorIcon = showIcon
        ? color
          ? color(event.kind)
          : 'black'
        : undefined;
      icon = Book;
      const matiere =
        event.abstract_object && `"${event.abstract_object.label}"`;
      const organisme =
        event.collective_actor && `à ${event.collective_actor.label}`;
      content = createContent(showIcon && 'enseigne', matiere, organisme);
      return (
        <InfoEvent
          dates={event.datation}
          icon={Book}
          hideOrColorIcon={colorIcon}
          mask={event.filtered}
          highlight={highlights[event.id]}
          select={event.selected}
          handleSelect={handleSelect}
        >
          {getEducationInfo(event, origin === 'Actor')}
        </InfoEvent>
      );
      break;
    }
    case 'ObtainQualification': {
      const qualite =
        event.social_characteristic && `"${event.social_characteristic.label}"`;
      const organisme =
        event.collective_actor && `à ${event.collective_actor.label}`;

      icon = MortarBoard;
      content = createContent(
        showIcon && 'obtient la qualité',
        qualite,
        organisme
      );
      break;
    }
    case 'PassageExamen': {
      const evaluateur = actor.id === event.actor_evaluer.id;
      const subject = event.abstract_object.label;
      const organisme = event.collective_actor.label;

      icon = Bookmark;
      content = createContent(
        evaluateur
          ? 'evalue ' + event.actor_evalue.label
          : 'évalué par ' + event.actor_evaluer.label,
        `pour "${subject}"`,
        `à ${organisme}`
      );
      break;
    }
    case 'Retirement': {
      icon = Home;
      content = 'Départ en retraite' + (showPlace ? ' de ' + actor.label : '');
      break;
    }

    case 'SuspensionActivity': {
      icon = Telescope;
      content = createContent(
        event.abstract_object && event.abstract_object.label
      );
      break;
    }

    default: {
      console.error('should not be here', event);

      icon = Question;
      content = (event as any).label;
    }
  }

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('sip-info--event', 'pb1', 'br2', {
        b: event.selected,
        'o-50': event.filtered,
        'bg-light-gray': highlights[event.id]
      })}
      onClick={handleSelect}
    >
      <span className="ph2">
        {showIcon && (
          <StyledOcticon
            iconColor={color ? color(event.kind) : 'black'}
            icon={icon}
            width={16}
            height={16}
          />
        )}
      </span>
      <FlexItem auto>{content}</FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export const MemoEventInfo = React.memo(EventInfo);
