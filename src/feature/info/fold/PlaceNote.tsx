import { LocationIcon } from '@primer/octicons-react';
import { isArray } from 'lodash/fp';
import React, { useMemo } from 'react';
import { EventGroup } from '../../../components/event/EventGroup';
import { EventLine } from '../../../components/event/EventLine';
import { LeftBottomSpacer } from '../../../components/event/LeftSpacer';
import { IconSpacer } from '../../../components/ui/IconSpacer';
import { Note } from '../../../components/ui/Note';
import { useClickSelect } from '../../../hooks/useClick';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import {
  EventGroup as EventGroupType,
  InformationPlaceGroup,
  Interactive,
} from '../../../v2/detail/information/types';
import { ProsoVisDetailRichEvent } from '../../../v2/types/events';
import { InteractiveEnlarge } from './InteractiveEnlarge';
import { useGroupEvents } from './useGroupEvents';

export const PlaceNote: React.FC<Interactive<InformationPlaceGroup>> =
  function ({ kind, events, group, selected, highlighted }) {
    const interactive = useMemo(
      () => events.map((e) => ({ id: e.event.id, kind: 'Event' })),
      [events]
    );
    const handleSelectClick = useClickSelect(interactive);

    const handleHighlightHover = useHoverHighlight(interactive);

    const groupedEvents = useGroupEvents(events);

    const title = (
      <InteractiveEnlarge
        {...handleSelectClick}
        {...handleHighlightHover}
        highlighted={highlighted}
        selected={selected}
      >
        <IconSpacer as="span" spaceRight spaceLeft>
          <LocationIcon aria-label="lieu" />
        </IconSpacer>
        <span>{group.label}</span>
      </InteractiveEnlarge>
    );

    const content = (
      <LeftBottomSpacer>
        {groupedEvents.map((e) =>
          isArray(e.events) ? (
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
