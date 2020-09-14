import React, { useMemo, useEffect, useState, useContext } from 'react';
import { PlusIcon, XIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActorThunk } from '../../thunks/actor';
import { stopEventPropagation } from '../../hooks/useClick';
import { selectActors } from '../../selectors/event';
import { deleteActor } from '../../reducers/eventSlice';
import { fetchActor } from '../../data/fetchActor';
import { getEvents } from '../../data';
import { AnyEvent } from '../../data/models';
import { DetailsMenuSpinner } from './DetailsMenuSpinner';
import { DetailsMenuEvents } from './DetailsMenuEvents';
import Axios from 'axios';
import DetailsMenuContext from './DetailsMenuContext';
import ActorLabel from '../../components/ActorLabel';
import { SiprojurisActor } from '../../data/sip-models';

export const DetailsMenuContent: React.FC<{
  actor: SiprojurisActor;
}> = function ({ actor }) {
  const dispatch = useDispatch();
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

  const [events, setEvents] = useState<AnyEvent[] | null>(null);

  useEffect(() => {
    setEvents(null);
    const source = Axios.CancelToken.source();

    fetchActor(actor.id, {
      cancelToken: source.token,
    })
      .then((response) => {
        setEvents(getEvents(response.data));
      })
      .catch((thrown) => {
        if (Axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.error(thrown);
        }
      });

    return () => {
      // cancelling to avoid collision between fetches
      source.cancel('changed to new actor');
    };
  }, [actor.id]);

  return (
    actor && (
      <div onMouseUp={stopEventPropagation}>
        <div>
          <span className="pointer" onClick={handleClick}>
            {Icon}
          </span>
          <ActorLabel actor={actor} />
        </div>
        {events ? (
          <DetailsMenuEvents events={events} />
        ) : (
          <DetailsMenuSpinner />
        )}
      </div>
    )
  );
};
