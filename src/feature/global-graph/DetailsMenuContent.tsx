import React, { useMemo, useEffect, useState } from 'react';
import { PlusIcon, XIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActorThunk } from '../../thunks/actor';
import { stopEventPropagation } from '../../hooks/useClick';
import { selectActors } from '../../selectors/event';
import { deleteActor } from '../../reducers/eventSlice';
import { fetchActor } from '../../data/fetchActor';
import { ActorCard, getEvents, AnyEvent, PrimaryKey } from '../../data';
import { DetailsMenuSpinner } from './DetailsMenuSpinner';
import { DetailsMenuEvents } from './DetailsMenuEvents';
import Axios from 'axios';
import ActorIcon from '../info/fold/ActorIcon';

export const DetailsMenuContent: React.FC<{
  id: PrimaryKey;
  label: string;
}> = function ({ id, label }) {
  const dispatch = useDispatch();
  const actors = useSelector(selectActors);
  const actorExists = actors[id] !== undefined;

  const icon = useMemo(
    () =>
      actorExists ? (
        <ActorIcon id={id} />
      ) : (
        <span
          className="pointer"
          onClick={() => {
            dispatch(fetchActorThunk(id));
          }}
        >
          <PlusIcon
            className="ma1 flex-shrink-0 green"
            verticalAlign="text-bottom"
            aria-label={'ajouter'}
          />
        </span>
      ),
    [actorExists, id, dispatch]
  );

  const [events, setEvents] = useState<AnyEvent[] | null>(null);

  useEffect(() => {
    setEvents(null);
    const source = Axios.CancelToken.source();

    fetchActor(id, { cancelToken: source.token })
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
  }, [id]);

  return (
    <div onMouseUp={stopEventPropagation}>
      <div>
        {icon}
        {label}
      </div>
      {events ? <DetailsMenuEvents events={events} /> : <DetailsMenuSpinner />}
    </div>
  );
};
