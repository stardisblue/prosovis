import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { selectActors } from '../../selectors/event';
import _ from 'lodash';
import Octicon, { X, Plus } from '@primer/octicons-react';
import { selectMaxActors, selectCurrent } from '../../selectors/maxActors';
import { addActorsThunk } from '../../thunks/actor';
import { resetCurrent } from '../../reducers/maxActorsSlice';
import { Flex } from '../../components/ui/Flex';

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
  const dispatch = useDispatch();
  const actors = useSelector(selectActors);
  const maxActors = useSelector(selectMaxActors);
  const current = useSelector(selectCurrent);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (_.size(actors) >= maxActors && current != null) {
      setShow(true);
      setCheckboxs(_.mapValues(actors, (actor) => ({ actor, checked: true })));
    }
  }, [actors, maxActors, current]);

  const [checkboxs, setCheckboxs] = useState({} as any);

  useEffect(() => {
    setCheckboxs(_.mapValues(actors, (actor) => ({ actor, checked: true })));
  }, [actors]);

  const switchCheckBox = useCallback((key: string) => {
    setCheckboxs((state: any) =>
      _.mapValues(state, (v, id) =>
        id.toString() === key.toString()
          ? { actor: v.actor, checked: !v.checked }
          : v
      )
    );
  }, []);

  const handleClick = useCallback(() => {
    if (current !== null) dispatch(addActorsThunk({ current, checkboxs }));
    setShow(false);
  }, [dispatch, current, checkboxs]);

  const handleCancel = useCallback(() => {
    dispatch(resetCurrent());
    setShow(false);
  }, [dispatch]);

  const checkedSize = useMemo(() => _.filter(checkboxs, 'checked').length, [
    checkboxs,
  ]);

  const color = checkedSize < maxActors ? 'green' : undefined;
  if (show)
    return (
      <AbsolDiv style={{ position: 'absolute' }}>
        <GreyPlane></GreyPlane>
        <Flexible>
          <ModalDiv color={color}>
            <h3>
              Impossible d'avoir plus de 5 acteurs: veuillez en supprimer un.
            </h3>
            <hr />
            {current && <div>Nouvel acteur : {current.label}</div>}
            <hr />
            <ul>
              {_.map(checkboxs, ({ actor, checked }, key) => (
                <ActorLine
                  key={key}
                  actor={actor}
                  switcher={switchCheckBox}
                  checked={checked}
                ></ActorLine>
              ))}
            </ul>
            <hr />

            <Flex justify="around">
              <button onClick={handleClick} disabled={checkedSize >= maxActors}>
                Terminer
                {/* {checkedSize >= maxActors &&
                  " sans supprimer d'acteurs" */}
              </button>
              <button onClick={handleCancel}>Annuler</button>
            </Flex>
          </ModalDiv>
        </Flexible>
      </AbsolDiv>
    );
  else return null;
};

export const ActorLine: React.FC<any> = function ({
  actor,
  checked,
  switcher,
}) {
  const handleClick = useCallback(() => {
    switcher(actor.id);
  }, [switcher, actor.id]);

  return (
    <div
      style={{
        opacity: checked ? undefined : 0.3,
      }}
    >
      <span className="pointer" onClick={handleClick}>
        <Octicon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          icon={checked ? X : Plus}
          ariaLabel={'Supprimer'}
        />
      </span>
      {actor.label}
    </div>
  );
};
