import React, { useMemo } from 'react';
import _ from 'lodash';
import { SelectedEvent, EventGroup as EventGroupType } from '../models';
import { Note } from '../../../components/ui/Note';
import {
  IconSpacer,
  IconSpacerPointer,
} from '../../../components/ui/IconSpacer';
import { XIcon, PersonIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteActor } from '../../../reducers/eventSlice';
import { selectSwitchActorColor } from '../../../selectors/switch';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { EnlargeFlex } from '../../../components/ui/Flex/styled-components';
import { useFlatClick, useClickSelect } from '../../../hooks/useClick';
import { SiprojurisActor, SiprojurisEvent } from '../../../data/sip-typings';
import { EventGroup } from '../../../components/event/EventGroup';
import { EventLine } from '../../../components/event/EventLine';
import { LeftBottomSpacer } from '../../../components/event/LeftSpacer';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { highlightable, selectable } from './styled-components';

const StyledPersonIcon = styled(PersonIcon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));

const StyledParagraph = styled.span`
  ${selectable}
`;

export const ActorNote: React.FC<{
  events: SelectedEvent<SiprojurisEvent>[];
  group: SiprojurisActor;
  masked: boolean;
  selected: boolean;
  highlighted: boolean;
}> = function ({ events, group, masked, selected, highlighted }) {
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

          if (e.selected !== undefined) {
            last.selected = last.selected || e.selected;
          }

          if (e.masked !== undefined) {
            last.masked = last.masked && e.masked;
          }

          return acc;
        },
        [] as EventGroupType<
          SelectedEvent<SiprojurisEvent>[] | SelectedEvent<SiprojurisEvent>
        >[]
      ),
    [events]
  );

  const color = useSelector(selectSwitchActorColor);

  return (
    <Note
      title={
        <HighlightableEnlarge
          highlighted={highlighted}
          {...handleSelectClick}
          {...handleHighlightHover}
        >
          <IconSpacerPointer as="span" {...handleDeleteClick}>
            <XIcon className="red" aria-label="Supprimer" />
          </IconSpacerPointer>
          <IconSpacer as="span">
            <StyledPersonIcon iconColor={color ? color(group.id) : undefined} />
          </IconSpacer>
          <StyledParagraph selected={selected}>
            <ActorLabel actor={group} short />
          </StyledParagraph>
        </HighlightableEnlarge>
      }
      flat
    >
      <LeftBottomSpacer borderColor={color ? color(group.id) : undefined}>
        {groupedEvents.map((e) =>
          _.isArray(e.events) ? (
            <EventGroup
              key={e.id}
              {...(e as EventGroupType<SelectedEvent<SiprojurisEvent>[]>)}
              origin={'Actor'}
            />
          ) : (
            <EventLine key={e.id} event={e.events} origin={'Actor'} />
          )
        )}
      </LeftBottomSpacer>
    </Note>
  );
};

const HighlightableEnlarge = styled(EnlargeFlex)`
  ${highlightable}
`;
