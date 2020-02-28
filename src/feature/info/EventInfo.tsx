import React, { useCallback } from 'react';
import classnames from 'classnames';
import { AnyEvent, Datation } from '../../data';
import { Flex, FlexItem } from '../../components/ui/Flex';
import _ from 'lodash';
import Octicon, {
  MortarBoard,
  X as XIcon,
  Plus,
  Question,
  Icon,
  Book,
  Bookmark,
  Home,
  Telescope
} from '@primer/octicons-react';
import { SelectedEvent } from './models';
import { useDispatch, useSelector } from 'react-redux';
import { setSelection } from '../../reducers/selectionSlice';
import { highlightsAsMap } from '../../selectors/highlight';
import { selectMainColor } from '../../selectors/color';
import { createSelector } from '@reduxjs/toolkit';
import { selectSwitch } from '../../reducers/switchSlice';

type EventInfoProps<T = AnyEvent> = {
  event: SelectedEvent<T>;
  origin: 'Actor' | 'NamedPlace';
  icon?: boolean;
};

export const EventDates: React.FC<{ dates: Datation[] }> = function({ dates }) {
  return (
    <div className="tr">
      {_.flatMap(dates, (d, index, array) =>
        array.length - 1 !== index ? (
          [
            <abbr
              key={d.id}
              className="nowrap"
              title={d.label + ' - ' + d.clean_date}
            >
              <time dateTime={d.clean_date} data-uri={d.uri}>
                {d.value}
              </time>
            </abbr>,
            <React.Fragment key={d.id + 'interspace'}> - </React.Fragment>
          ]
        ) : (
          <abbr
            key={d.id}
            className="nowrap"
            title={d.label + ' - ' + d.clean_date}
          >
            <time dateTime={d.clean_date} data-uri={d.uri}>
              {d.value}
            </time>
          </abbr>
        )
      )}
    </div>
  );
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

const selectColor = createSelector(
  selectSwitch,
  selectMainColor,
  (switcher, main) => {
    if (switcher === 'Kind') return main;
    else return () => 'black';
  }
);

export const EventInfo: React.FC<EventInfoProps> = function({
  event,
  origin,
  icon: showIcon = true
}) {
  let icon: Icon<number, number>;
  let content;
  const color = useSelector(selectColor);
  const { actor } = event;
  const place = origin === 'NamedPlace';

  const createContent = prefix(place, actor.label);

  const highlights = useSelector(highlightsAsMap);

  const dispatch = useDispatch();
  const handleSelection = useCallback(() => {
    dispatch(setSelection({ id: event.id, kind: 'Event' }));
  }, [dispatch, event.id]);

  switch (event.kind) {
    case 'Birth': {
      icon = Plus;
      content =
        'Naissance' +
        (place
          ? ` de ${actor.label}`
          : event.localisation
          ? ` à ${event.localisation.label}`
          : '');
      break;
    }
    case 'Death': {
      icon = XIcon;
      content =
        'Décès' +
        (place
          ? ` de ${actor.label}`
          : event.localisation
          ? ` à ${event.localisation.label}`
          : '');
      break;
    }
    case 'Education': {
      icon = Book;
      const matiere =
        event.abstract_object && `"${event.abstract_object.label}"`;
      const organisme =
        event.collective_actor && `à ${event.collective_actor.label}`;
      content = createContent(showIcon && 'enseigne', matiere, organisme);
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
      content = 'Départ en retraite' + (place ? ' de ' + actor.label : '');
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
      onClick={handleSelection}
    >
      <span className="ph2" style={{ color: color(event.kind) }}>
        {showIcon && <Octicon icon={icon} width={16} height={16} />}
      </span>
      <FlexItem auto>{content}</FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export const MemoEventInfo = React.memo(EventInfo);
