import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { XIcon, PlusIcon } from '@primer/octicons-react';
import { Flex } from '../../components/ui/Flex';
import ActorLabel from '../../components/ActorLabel';
import {
  selectCurrent,
  selectMaxActors,
} from '../../v2/selectors/detail/maxActors';
import { resetCurrent } from '../../v2/reducers/detail/maxActorsSlice';
import { validateDetailActorsThunk } from '../../v2/thunks/actors';
import { selectDetailActors } from '../../v2/selectors/detail/actors';
import { filter, size } from 'lodash/fp';
import { mapValues, map } from 'lodash';
import { ProsoVisActor } from '../../v2/types/actors';

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
  const actors = useSelector(selectDetailActors);
  const maxActors = useSelector(selectMaxActors);
  const current = useSelector(selectCurrent);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (size(actors) >= maxActors && current != null) {
      setShow(true);
      setCheckboxs(mapValues(actors, (actor) => ({ actor, checked: true })));
    }
  }, [actors, maxActors, current]);

  const [checkboxs, setCheckboxs] = useState(
    {} as _.Dictionary<{ actor: ProsoVisActor; checked: boolean }>
  );

  useEffect(() => {
    setCheckboxs(mapValues(actors, (actor) => ({ actor, checked: true })));
  }, [actors]);

  const switchCheckBox = useCallback((key: string) => {
    setCheckboxs((state) =>
      mapValues(state, (v, id) =>
        id.toString() === key.toString()
          ? { actor: v.actor, checked: !v.checked }
          : v
      )
    );
  }, []);

  const handleClick = useCallback(() => {
    if (current !== null)
      dispatch(validateDetailActorsThunk({ current, checkboxs }));
    setShow(false);
  }, [dispatch, current, checkboxs]);

  const handleCancel = useCallback(() => {
    dispatch(resetCurrent());
    setShow(false);
  }, [dispatch]);

  const checkedSize = useMemo(
    () => filter((c) => c.checked, checkboxs).length,
    [checkboxs]
  );

  const color = checkedSize < maxActors ? 'green' : undefined;
  if (show)
    return (
      <AbsolDiv style={{ position: 'absolute' }}>
        <GreyPlane></GreyPlane>
        <Flexible>
          <ModalDiv color={color}>
            <h3>
              Impossible d'avoir plus de 5 acteurs : veuillez en supprimer au
              moins un.
            </h3>
            <hr />
            {current && (
              <div>
                Nouvel acteur : <ActorLabel id={current} />
              </div>
            )}
            <hr />
            <ul>
              {map(checkboxs, ({ actor, checked }, key) => (
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
              <button onClick={handleCancel}>Annuler</button>
              <button onClick={handleClick} disabled={checkedSize >= maxActors}>
                Terminer
                {/* {checkedSize >= maxActors &&
                  " sans supprimer d'acteurs" */}
              </button>
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

  const Icon = checked ? XIcon : PlusIcon;
  return (
    <div
      style={{
        opacity: checked ? undefined : 0.3,
      }}
    >
      <span className="pointer" onClick={handleClick}>
        <Icon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          aria-label={'Supprimer'}
        />
      </span>
      <ActorLabel id={actor} />
    </div>
  );
};
