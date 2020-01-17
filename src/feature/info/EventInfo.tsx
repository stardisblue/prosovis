import React, { useContext } from 'react';
import classnames from 'classnames';
import { AnyEvent, Datation } from '../../data';
import { Flex } from '../../components/ui/Flex';
import _ from 'lodash';
import Octicon, {
  MortarBoard,
  X as XIcon,
  Plus,
  Question,
  Icon,
  Milestone
} from '@primer/octicons-react';
import { ColorContext } from '../../context/ColorContext';
import { FlexItem } from '../../components/ui/Flex/FlexItem';

type Selected<T = AnyEvent> = T & {
  selected?: boolean;
  filtered?: boolean;
};

type EventInfoProps<T = AnyEvent> = {
  event: Selected<T>;
};

const EventDates: React.FC<{ dates: Datation[] }> = function({ dates }) {
  return (
    <div>
      {_.flatMap(dates, (d, index, array) =>
        array.length - 1 !== index ? (
          [
            <abbr key={d.id} className="nowrap" title={d.label}>
              <time dateTime={d.clean_date} data-uri={d.uri}>
                {d.value}
              </time>
            </abbr>,
            <> - </>
          ]
        ) : (
          <abbr key={d.id} className="nowrap" title={d.label}>
            <time dateTime={d.clean_date} data-uri={d.uri}>
              {d.value}
            </time>
          </abbr>
        )
      )}
    </div>
  );
};

export const EventInfo: React.FC<EventInfoProps> = function({ event }) {
  let icon: Icon<number, number> = Question;
  let content = <div>{event.label}</div>;
  const { color } = useContext(ColorContext);

  switch (event.kind) {
    case 'Birth': {
      icon = Plus;
      content = (
        <>Naissance {event.localisation && 'à ' + event.localisation.label}</>
      );
      break;
    }
    case 'Death': {
      icon = XIcon;
      content = (
        <>Décès {event.localisation && 'à ' + event.localisation.label}</>
      );
      break;
    }
    case 'Education': {
      const matiere =
        event.abstract_object && '"' + event.abstract_object.label + '"';
      const organisme = event.collective_actor && (
        <>
          <br /> à {event.collective_actor.label}
        </>
      );

      icon = MortarBoard;
      content = (
        <>
          Enseigne {matiere} {organisme}
        </>
      );
      break;
    }
    case 'ObtainQualification': {
      const qualite =
        event.social_characteristic &&
        '"' + event.social_characteristic.label + '"';
      const organisme =
        event.collective_actor && 'par ' + event.collective_actor.label;

      icon = Milestone;
      content = (
        <>
          Obtient la qualité {qualite} {organisme}
        </>
      );
      break;
    }
  }

  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('sip-info--event', {
        b: event.selected,
        'o-50': event.filtered
      })}
    >
      <span className="pa2" style={{ color: color(event.kind) }}>
        <Octicon icon={icon} />
      </span>
      <FlexItem auto>{content}</FlexItem>
      <EventDates dates={event.datation} />
    </Flex>
  );
};

export const MemoEventInfo = React.memo(EventInfo);
