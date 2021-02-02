import React, { useMemo, useEffect, useState, useContext } from 'react';
import { PlusIcon, XIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActorThunk } from '../../thunks/actor';
import { stopEventPropagation } from '../../hooks/useClick';
import { selectActors } from '../../selectors/event';
import { deleteActor } from '../../reducers/eventSlice';
import { DetailsMenuEvents } from './DetailsMenuEvents';
import DetailsMenuContext from './DetailsMenuContext';
import ActorLabel from '../../components/ActorLabel';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../components/ui/IconSpacer';
import { lightgray } from '../../components/ui/colors';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { ProsoVisActor } from '../../v2/types/actors';
import { selectEventIndex } from '../../v2/selectors/events';
import { ProsoVisEvent } from '../../v2/types/events';
import Loading from '../../v2/components/Loading';
import { get } from 'lodash/fp';

export const DetailsMenuContent: React.FC<{
  actor: ProsoVisActor;
}> = function ({ actor }) {
  const dispatch = useDispatch();
  const { setMenuTarget } = useContext(DetailsMenuContext);
  const actors = useSelector(selectActors);
  const actorExists = actor && actors[actor.id] !== undefined;

  const eventsIndex = useSelector(selectEventIndex);

  const [handleClick, Icon] = useMemo(
    () =>
      actorExists
        ? [
            () => {
              dispatch(deleteActor(actor.id));
              setMenuTarget(null);
            },
            <XIcon
              className="ma1 flex-shrink-0 red"
              verticalAlign="text-bottom"
              aria-label={'supprimer'}
            />,
          ]
        : [
            () => {
              dispatch(fetchActorThunk(actor.id));
              setMenuTarget(null);
            },
            <PlusIcon
              className="ma1 flex-shrink-0 green"
              verticalAlign="text-bottom"
              aria-label={'ajouter'}
            />,
          ],
    [actorExists, actor, dispatch, setMenuTarget]
  );

  const [events, setEvents] = useState<ProsoVisEvent[] | null>(null);

  useEffect(() => {
    setEvents(get(actor.id, eventsIndex) || null);
  }, [actor.id, eventsIndex]);

  return (
    <Base onMouseUp={stopEventPropagation}>
      <ActorTitle>
        <IconSpacerPointer spaceRight onClick={handleClick}>
          {Icon}
        </IconSpacerPointer>
        <ActorLabel id={actor} />
      </ActorTitle>
      <Loading finished={events}>
        {events && <DetailsMenuEvents events={events} />}
      </Loading>
    </Base>
  );
};

const ActorTitle = styled(StyledFlex)`
  border-bottom: 1px solid ${lightgray};
`;

const Base = styled(StyledFlex)`
  flex-direction: column;
  height: 100%;
`;
