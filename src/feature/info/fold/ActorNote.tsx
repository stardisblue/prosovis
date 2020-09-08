import { XIcon } from '@primer/octicons-react';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { ColorablePersonIcon } from '../../../components/ColorablePersonIcon';
import { EventGroup } from '../../../components/event/EventGroup';
import { EventLine } from '../../../components/event/EventLine';
import { LeftBottomSpacer } from '../../../components/event/LeftSpacer';
import { EnlargeFlex } from '../../../components/ui/Flex/styled-components';
import {
  IconSpacer,
  IconSpacerPointer,
} from '../../../components/ui/IconSpacer';
import { Note } from '../../../components/ui/Note';
import { SiprojurisActor, SiprojurisEvent } from '../../../data/sip-models';
import { useClickSelect, useFlatClick } from '../../../hooks/useClick';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { deleteActor } from '../../../reducers/eventSlice';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { EventGroup as EventGroupType, SelectedEvent } from '../models';
import {
  highlightable,
  selectable,
  HighlightableProp,
  SelectableProp,
} from './styled-components';

const HighlightableEnlarge = styled(EnlargeFlex)<
  HighlightableProp & SelectableProp
>`
  padding-top: 1px;
  padding-bottom: 1px;
  ${highlightable}
  ${selectable}
`;

export const ActorNote: React.FC<{
  events: SelectedEvent<SiprojurisEvent>[];
  group: SiprojurisActor;
  masked?: boolean;
  selected: boolean;
  highlighted: boolean;
}> = function ({ events, group, selected, highlighted }) {
  const dispatch = useDispatch();
  const interactive = useMemo(
    () => _.map(events, (e) => ({ id: e.id, kind: 'Event' })),
    [events]
  );
  const handleSelectClick = useClickSelect(interactive);
  const handleDeleteClick = useFlatClick(() => {
    dispatch(deleteActor(group.id));
  });
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

  const color = useSelector(selectSwitchActorColor);

  const title = (
    <HighlightableEnlarge
      {...handleSelectClick}
      {...handleHighlightHover}
      highlighted={highlighted}
      selected={selected}
    >
      <IconSpacerPointer as="span" {...handleDeleteClick} spaceRight>
        <XIcon className="red" aria-label="Supprimer" />
      </IconSpacerPointer>
      <IconSpacer as="span" spaceRight>
        <ColorablePersonIcon
          iconColor={color ? color(group.id) : undefined}
          aria-label="individu"
        />
      </IconSpacer>
      <ActorLabel as="span" actor={group} short />
    </HighlightableEnlarge>
  );

  const content = (
    <LeftBottomSpacer borderColor={color ? color(group.id) : undefined}>
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
