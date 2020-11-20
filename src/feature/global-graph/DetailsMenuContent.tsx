import React, { useMemo, useEffect, useState, useContext } from 'react';
import { PlusIcon, XIcon, XCircleFillIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActorThunk } from '../../thunks/actor';
import { stopEventPropagation, useFlatClick } from '../../hooks/useClick';
import { selectActors } from '../../selectors/event';
import { deleteActor } from '../../reducers/eventSlice';
import { fetchActor } from '../../data/fetchActor';
import { getEvents } from '../../data';
import { SiprojurisEvent } from '../../data/sip-models';
import { DetailsMenuSpinner } from './DetailsMenuSpinner';
import { DetailsMenuEvents } from './DetailsMenuEvents';
import Axios from 'axios';
import DetailsMenuContext from './DetailsMenuContext';
import ActorLabel from '../../components/ActorLabel';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../components/ui/IconSpacer';
import { lightgray, red } from '../../components/ui/colors';
import { setOffline, setOnline } from '../../reducers/serverStatusSlice';
import { selectServerStatus } from '../../selectors/serverStatus';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { Button } from '../../components/Button';
import { ProsoVisActor } from '../../v2/types/actors';

export const DetailsMenuContent: React.FC<{
  actor: ProsoVisActor;
}> = function ({ actor }) {
  const dispatch = useDispatch();
  const online = useSelector(selectServerStatus);
  const { setMenuTarget } = useContext(DetailsMenuContext);
  const actors = useSelector(selectActors);
  const actorExists = actor && actors[actor.id] !== undefined;

  const [handleClick, Icon] = useMemo(
    () =>
      actorExists
        ? [
            () => {
              if (actor) dispatch(deleteActor(actor.id));
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
              if (actor) dispatch(fetchActorThunk(actor.id));
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

  const [events, setEvents] = useState<SiprojurisEvent[] | null>(null);

  const [retry, setRetryCount] = useState(0);
  const [disableRetryButton, setRetryButtonState] = useState(false);

  useEffect(() => {
    if (retry !== 0) {
      setRetryButtonState(true);
    }
  }, [retry]);

  const flatRetryClick = useFlatClick(() => {
    setRetryCount((state) => {
      return state + 1;
    });
  });

  useEffect(() => {
    setEvents(null);
    const source = Axios.CancelToken.source();
    fetchActor(actor.id, {
      cancelToken: source.token,
    })
      .then((response) => {
        dispatch(setOnline());
        setEvents(getEvents(response.data));
      })
      .catch((thrown) => {
        if (Axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          setRetryButtonState(false);
          dispatch(setOffline());
        }
      });

    return () => {
      // cancelling to avoid collision between fetches
      source.cancel('changed to new actor');
    };
  }, [actor.id, online, retry, dispatch]);

  return (
    actor && (
      <Base onMouseUp={stopEventPropagation}>
        <ActorTitle>
          <IconSpacerPointer spaceRight onClick={handleClick}>
            {Icon}
          </IconSpacerPointer>
          <ActorLabel actor={actor} />
        </ActorTitle>
        {events ? (
          <DetailsMenuEvents events={events} />
        ) : online ? (
          <DetailsMenuSpinner />
        ) : (
          <OfflineBase>
            <SipErrorIcon size={24} />
            <div>
              Le serveur distant n'as pas pu être joint, veuillez réessayer plus
              tard ou notifiez nous à chen@lirmm.fr
            </div>
            <Button {...flatRetryClick} disabled={disableRetryButton}>
              Réessayer {retry !== 0 && retry}
            </Button>
          </OfflineBase>
        )}
      </Base>
    )
  );
};

const SipErrorIcon = styled(XCircleFillIcon)`
  color: ${red};
`;

const OfflineBase = styled(StyledFlex)`
  align-items: center;
  flex-direction: column;
`;

const ActorTitle = styled(StyledFlex)`
  border-bottom: 1px solid ${lightgray};
`;

const Base = styled(StyledFlex)`
  flex-direction: column;
  height: 100%;
`;
