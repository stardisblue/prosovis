import styled from 'styled-components/macro';
import React, { useContext, useMemo } from 'react';
import DetailsMenuContext from './DetailsMenuContext';
import { getDimensionObject } from '../../hooks/useDimensions';
import { Spring, animated } from 'react-spring/renderprops';
import { PlusIcon, XIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActorThunk } from '../../thunks/actor';
import { stopEventPropagation } from '../../hooks/useClick';
import { selectActors } from '../../selectors/event';
import { deleteActor } from '../../reducers/eventSlice';

const StyledDiv = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9998;
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  box-shadow: 0 0 3px gray;
  padding: 0 1em;
`;

function DetailsMenu() {
  const dispatch = useDispatch();
  const actors = useSelector(selectActors);
  const { menuTarget } = useContext(DetailsMenuContext);
  const { actor } = menuTarget || { actor: null };

  const coords = useMemo(() => {
    if (menuTarget) {
      const { right: x, top: y } = getDimensionObject(menuTarget.ref);
      return [x, y];
    }
  }, [menuTarget]);

  const onMouseUp = stopEventPropagation;

  const actorExists = actor && actors[actor.id] !== undefined;

  const [handleClick, Icon] = useMemo(
    () =>
      actorExists
        ? [
            () => {
              if (actor) dispatch(deleteActor(actor.id));
            },
            XIcon,
          ]
        : [
            () => {
              if (actor) dispatch(fetchActorThunk(actor.id));
            },
            PlusIcon,
          ],
    [actorExists, actor, dispatch]
  );

  const content = useMemo(() => {
    if (actor) {
      return (
        <div onMouseUp={onMouseUp}>
          <span className="pointer" onClick={handleClick}>
            <Icon
              className="ma1 flex-shrink-0 green"
              verticalAlign="text-bottom"
              aria-label={'ajouter'}
            />
          </span>
          {actor.label}
        </div>
      );
    }
  }, [actor, handleClick, onMouseUp]);

  return (menuTarget && coords && (
    <Spring
      native
      to={{
        transform: `translate3d(${coords[0]}px, ${coords[1]}px, 0)`,
      }}
    >
      {(props) => <StyledDiv style={props}>{content}</StyledDiv>}
    </Spring>
  )) as any;
}

export default DetailsMenu;
