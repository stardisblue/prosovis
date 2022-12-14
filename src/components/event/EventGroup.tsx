import { compact, isNil } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getKindString } from '../../data/getEventLabel';
import getEventIcon from '../../data/getEventIcon';
import {
  highlightable,
  HighlightableProp,
  maskable,
  MaskableProp,
  SelectableProp,
} from '../../feature/info/fold/styled-components';
import useHoverHighlight from '../../hooks/useHoverHighlight';
import { selectSwitchKindColor } from '../../selectors/switch';
import { IconSpacer } from '../ui/IconSpacer';
import { Note } from '../ui/Note';
import { EventLine } from './EventLine';
import { LeftSpacer } from './LeftSpacer';
import { SimpleEventErrors } from './EventErrors';
import { ProsoVisDetailRichEvent } from '../../v2/types/events';
import {
  EventGroup as EventGroupType,
  InformationGroup,
  Interactive,
} from '../../v2/detail/information/types';
import { ProsoVisDates } from '../../v2/components/ProsoVisDateComponent';

export const LeftBottomSpacer = styled(LeftSpacer)`
  border-bottom-style: solid;
  padding-bottom: 2px;
  margin-bottom: 2px;
  margin-right: 2px;
`;

export const EventGroup: React.FC<
  EventGroupType<Interactive<ProsoVisDetailRichEvent>[]> & {
    origin: InformationGroup['kind'];
  }
> = function ({ kind, events, start, end, origin }) {
  const interactive = useMemo(
    () => events.map(({ event: { id } }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHighLightHover = useHoverHighlight(interactive);

  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  /* Computed */
  const isHighlighted = useMemo(
    () => events.some((e) => e.highlighted),
    [events]
  );
  const isMasked = useMemo(() => events.every((e) => e.masked), [events]);
  const isSelected = useMemo(() => events.some((e) => e.selected), [events]);

  const eventErrors = useMemo(
    () => compact(events.flatMap((e) => e.errors)),
    [events]
  );

  const showErrors = useMemo(
    function () {
      return (
        !isNil(eventErrors) &&
        eventErrors.length > 0 && <SimpleEventErrors errors={eventErrors} />
      );
    },
    [eventErrors]
  );

  return (
    <Note
      title={
        <InteractableEnlarge
          masked={isMasked}
          selected={isSelected}
          highlighted={isHighlighted}
          {...handleHighLightHover}
        >
          <IconSpacer spaceRight>
            <Icon iconColor={color ? color(kind) : undefined} />
          </IconSpacer>
          <div>
            {events.length} {getKindString(kind)}
          </div>
          <ProsoVisDates dates={compact([start, end])} />
          {showErrors}
        </InteractableEnlarge>
      }
    >
      <LeftBottomSpacer borderColor={color ? color(kind) : undefined}>
        {events.map((e) => (
          <EventLine key={e.event.id} event={e} origin={origin} grouped />
        ))}
      </LeftBottomSpacer>
    </Note>
  );
};

const InteractableEnlarge = styled.div<
  HighlightableProp & MaskableProp & SelectableProp
>`
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 0.25em;
  padding-right: 0.25em;
  ${highlightable}
  ${maskable}
  ${({ selected }: SelectableProp) => selected && 'font-weight: 700;'}
`;
