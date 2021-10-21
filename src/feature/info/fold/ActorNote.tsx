import { XIcon } from '@primer/octicons-react';
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
import { ProsoVisDetailRichEvent } from '../../../v2/types/events';
import {
  EventGroup as EventGroupType,
  InformationActorGroup,
  Interactive,
} from '../../../v2/detail/information/types';
import { InteractiveEnlarge } from './InteractiveEnlarge';
import { useGroupEvents } from './useGroupEvents';

export const ActorNote: React.FC<Required<Interactive<InformationActorGroup>>> =
  function ({ kind, events, group, selected, highlighted }) {
    const dispatch = useDispatch();
    const interactive = useMemo(
      () => events.map((e) => ({ id: e.event.id, kind: 'Event' })),
      [events]
    );
    const handleSelectClick = useClickSelect(interactive);
    const handleDeleteClick = useFlatClick(() => {
      dispatch(removeDetailActor(group.id));
    });
    const handleHighlightHover = useHoverHighlight(interactive);

    const groupedEvents = useGroupEvents(events);

    const color = useSelector(selectSwitchActorColor);

    const title = (
      <InteractiveEnlarge
        {...handleSelectClick}
        {...handleHighlightHover}
        highlighted={highlighted}
        selected={selected}
      >
        <IconSpacerPointer
          as="span"
          {...handleDeleteClick}
          spaceLeft
          spaceRight
        >
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
              origin={kind}
            />
          ) : (
            <EventLine key={e.id} event={e.events} origin={kind} />
          )
        )}
      </LeftBottomSpacer>
    );

    return <Note as={React.Fragment} title={title} children={content} />;
  };
