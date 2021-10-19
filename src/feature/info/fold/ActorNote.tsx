import { XIcon } from '@primer/octicons-react';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActorLabel from '../../../components/ActorLabel';
import { ColorablePersonIcon } from '../../../components/ColorablePersonIcon';
import { EventGroup } from '../../../components/event/EventGroup';
import { EventLine } from '../../../components/event/EventLine';
import { LeftBottomSpacer } from '../../../components/event/LeftSpacer';
import {
  IconSpacer,
  IconSpacerPointer,
} from '../../../components/ui/IconSpacer';
import { Note } from '../../../components/ui/Note';
import { useClickSelect, useFlatClick } from '../../../hooks/useClick';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { removeDetailActor } from '../../../v2/reducers/detail/actorSlice';
import { ProsoVisActor } from '../../../v2/types/actors';
import { ProsoVisDetailRichEvent } from '../../../v2/types/events';
import {
  EventGroup as EventGroupType,
  Interactive,
} from '../../../v2/detail/information/types';
import { InteractiveEnlarge } from './InteractiveEnlarge';

export const ActorNote: React.FC<{
  events: Interactive<ProsoVisDetailRichEvent>[];
  group: ProsoVisActor;
  masked?: boolean;
  selected: boolean;
  highlighted: boolean;
}> = function ({ events, group, selected, highlighted }) {
  const dispatch = useDispatch();
  const interactive = useMemo(
    () => _.map(events, (e) => ({ id: e.event.id, kind: 'Event' })),
    [events]
  );
  const handleSelectClick = useClickSelect(interactive);
  const handleDeleteClick = useFlatClick(() => {
    dispatch(removeDetailActor(group.id));
  });
  const handleHighlightHover = useHoverHighlight(interactive);

  const groupedEvents = useMemo(
    () =>
      _.reduce(
        events,
        (acc, e) => {
          const { event } = e;
          let last = _.last(acc);

          if (last === undefined || last.kind !== event.kind) {
            acc.push({
              id: event.id,
              kind: event.kind,
              events: e,
              start: _.first(event.datation)!,
              end: _.last(event.datation)!,
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

          last.start = _.minBy([last.start, _.first(event.datation)], 'value')!;
          last.end = _.maxBy([last.end, _.last(event.datation)], 'value')!;

          return acc;
        },
        [] as EventGroupType<
          | Interactive<ProsoVisDetailRichEvent>[]
          | Interactive<ProsoVisDetailRichEvent>
        >[]
      ),
    [events]
  );

  const color = useSelector(selectSwitchActorColor);

  const title = (
    <InteractiveEnlarge
      {...handleSelectClick}
      {...handleHighlightHover}
      highlighted={highlighted}
      selected={selected}
    >
      <IconSpacerPointer as="span" {...handleDeleteClick} spaceLeft spaceRight>
        <XIcon className="red" aria-label="Supprimer" />
      </IconSpacerPointer>
      <IconSpacer as="span" spaceRight>
        <ColorablePersonIcon
          iconColor={color ? color(group.id) : undefined}
          aria-label="individu"
        />
      </IconSpacer>
      <ActorLabel as="span" id={group} />
    </InteractiveEnlarge>
  );

  const content = (
    <LeftBottomSpacer borderColor={color ? color(group.id) : undefined}>
      {groupedEvents.map((e) =>
        Array.isArray(e.events) ? (
          <EventGroup
            key={e.id}
            {...(e as EventGroupType<Interactive<ProsoVisDetailRichEvent>[]>)}
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
