import { LocationIcon } from '@primer/octicons-react';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { EventGroup } from '../../../components/event/EventGroup';
import { EventLine } from '../../../components/event/EventLine';
import { LeftBottomSpacer } from '../../../components/event/LeftSpacer';
import { EnlargeFlex } from '../../../components/ui/Flex/styled-components';
import { IconSpacer } from '../../../components/ui/IconSpacer';
import { Note } from '../../../components/ui/Note';
import {
  SiprojurisEvent,
  SiprojurisNamedPlace,
} from '../../../data/sip-typings';
import { useClickSelect } from '../../../hooks/useClick';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { EventGroup as EventGroupType, SelectedEvent } from '../models';
import {
  highlightable,
  selectable,
  HighlightableProp,
  SelectableProp,
} from './styled-components';

const InteractiveEnlarge = styled(EnlargeFlex)<
  HighlightableProp & SelectableProp
>`
  padding-top: 1px;
  padding-bottom: 1px;
  ${highlightable}
  ${selectable}
`;

export const PlaceNote: React.FC<{
  events: SelectedEvent<SiprojurisEvent>[];
  group: SiprojurisNamedPlace;
  masked?: boolean;
  selected: boolean;
  highlighted: boolean;
}> = function ({ events, group, selected, highlighted }) {
  const interactive = useMemo(
    () => _.map(events, (e) => ({ id: e.id, kind: 'Event' })),
    [events]
  );
  const handleSelectClick = useClickSelect(interactive);

  const handleHighlightHover = useHoverHighlight(interactive);

  const groupedEvents = useMemo(
    () =>
      _.reduce(
        events,
        (acc, e) => {
          let last = _.last(acc);

          if (last === undefined || last.kind !== e.kind) {
            acc.push({
              id: e.id,
              kind: e.kind,
              events: e,
              start: _.first(e.datation)!,
              end: _.last(e.datation)!,
              masked: e.masked,
              selected: e.selected,
              highlighted: e.highlighted,
            });
            return acc;
          }
          if (_.isArray(last.events)) {
            last.events.push(e);
          } else {
            last.events = [last.events, e];
          }

          last.start = _.minBy(
            [last.start, _.first(e.datation)],
            'clean_date'
          )!;
          last.end = _.maxBy([last.end, _.last(e.datation)], 'clean_date')!;

          return acc;
        },
        [] as EventGroupType<
          SelectedEvent<SiprojurisEvent>[] | SelectedEvent<SiprojurisEvent>
        >[]
      ),
    [events]
  );

  const title = (
    <InteractiveEnlarge
      {...handleSelectClick}
      {...handleHighlightHover}
      highlighted={highlighted}
      selected={selected}
    >
      <IconSpacer as="span" spaceRight>
        <LocationIcon aria-label="lieu" />
      </IconSpacer>
      <span>{group.label}</span>
    </InteractiveEnlarge>
  );

  const content = (
    <LeftBottomSpacer>
      {groupedEvents.map((e) =>
        Array.isArray(e.events) ? (
          <EventGroup
            key={e.id}
            {...(e as EventGroupType<SelectedEvent<SiprojurisEvent>[]>)}
            origin={group.kind}
          />
        ) : (
          <EventLine key={e.id} event={e.events} origin={group.kind} />
        )
      )}
    </LeftBottomSpacer>
  );

  return <Note as={React.Fragment} title={title} children={content} />;
};
