import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { selectActors } from '../../selectors/event';
import _ from 'lodash';
import Octicon, { X } from '@primer/octicons-react';
import { deleteActor } from '../../reducers/eventSlice';
import { selectMaxActors } from '../../selectors/maxActors';

export const AbsolDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`;
export const GreyPlane = styled(AbsolDiv)`
  background-color: black;
  opacity: 0.2;
  z-index: initial;
`;
export const Flexible = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
export const ModalDiv = styled.div`
  background-color: white;
  position: relative;
  max-width: 30em;
  padding: 1em;
  border-radius: 3px;
  width: auto;
  filter: drop-shadow(0 0 0.5em ${(props) => props.color || 'red'});
`;

export const ActorModal: React.FC = function () {
  const actors = useSelector(selectActors);
  const maxActors = useSelector(selectMaxActors);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (_.size(actors) > maxActors) {
      setShow(true);
    }
  }, [actors, maxActors]);
  const handleClick = useCallback(() => {
    setShow(false);
  }, []);
  const color = _.size(actors) <= maxActors || show ? 'green' : undefined;
  if (_.size(actors) > maxActors || show)
    return (
      <AbsolDiv style={{ position: 'absolute' }}>
        <GreyPlane></GreyPlane>
        <Flexible>
          <ModalDiv color={color}>
            <h3>Veuillez supprimer au moins un acteur pour continuer</h3>
            <hr />
            <ul>
              {_.map(actors, (a) => (
                <ActorLine key={a.id} actor={a}></ActorLine>
              ))}
            </ul>
            {_.size(actors) <= maxActors && (
              <button onClick={handleClick}>Terminé</button>
            )}
          </ModalDiv>
        </Flexible>
      </AbsolDiv>
    );
  else return null;
};

export const ActorLine: React.FC<any> = function ({ actor }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(deleteActor(actor.id));
  }, [dispatch, actor.id]);
  return (
    <div>
      <span className="pointer" onClick={handleClick}>
        <Octicon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          icon={X}
          ariaLabel={'Supprimer'}
        />
      </span>
      {actor.label}
    </div>
  );
};
