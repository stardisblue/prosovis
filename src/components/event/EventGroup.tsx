import { every, flatMap, get, some, compact } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getKindString } from '../../data/getEventLabel';
import { ProsoVisError } from '../../v2/types/errors';
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
import { EventDates } from '../DateComponent';
import { SimpleEventErrors } from './EventErrors';
import {
  ProsoVisDate,
  ProsoVisDetailRichEvent,
  ProsoVisEvent,
} from '../../v2/types/events';
import { ProsoVisActor } from '../../v2/types/actors';
import { Interactive } from '../../v2/detail/information/types';
import { ProsoVisPlace } from '../../v2/types/localisations';

export const LeftBottomSpacer = styled(LeftSpacer)`
  border-bottom-style: solid;
  padding-bottom: 2px;
  margin-bottom: 2px;
  margin-right: 2px;
`;

export const EventGroup: React.FC<{
  kind: ProsoVisEvent['kind'];
  events: Interactive<ProsoVisDetailRichEvent>[];
  start: ProsoVisDate;
  end: ProsoVisDate;
  origin: ProsoVisActor['kind'] | ProsoVisPlace['kind'];
}> = function ({ kind, events, start, end, origin }) {
  const interactive = useMemo(
    () => events.map(({ event: { id } }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHighLightHover = useHoverHighlight(interactive);

  const color = useSelector(selectSwitchKindColor);

  const Icon = getEventIcon(kind);

  /* Computed */
  const isHighlighted = useMemo(
    () => some(['highlighted', true], events),
    [events]
  );
  const isMasked = useMemo(() => every(['masked', true], events), [events]);
  const isSelected = useMemo(() => some(['selected', true], events), [events]);

  const eventErrors = compact(
    flatMap<typeof events, ProsoVisError>(get('errors'), events)
  );

  const showErrors = useMemo(
    function () {
      return (
        eventErrors !== undefined &&
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
          <EventDates dates={[start, end]} />
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
