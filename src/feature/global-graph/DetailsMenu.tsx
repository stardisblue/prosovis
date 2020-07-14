import styled from 'styled-components/macro';
import React, { useContext } from 'react';
import DetailsMenuContext from './DetailsMenuContext';
import { Spring, animated } from 'react-spring/renderprops';
import { DetailsMenuContent } from './DetailsMenuContent';
import { stopEventPropagation } from '../../hooks/useClick';

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  z-index: 9998;
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  box-shadow: 0 0 3px gray;
  padding: 0 1em;
`;

function DetailsMenu() {
  const { menuTarget } = useContext(DetailsMenuContext);

  if (menuTarget) {
    const { x, y, width } = menuTarget;
    return (menuTarget && (
      <Spring
        native
        to={{
          transform: `translate3d(${x + width}px, ${y}px, 0)`,
        }}
      >
        {(props) => (
          <animated.foreignObject
            style={props}
            width="250"
            height="300"
            onClick={stopEventPropagation}
            onWheel={stopEventPropagation}
          >
            <StyledDiv>
              <DetailsMenuContent actor={menuTarget.actor} />
            </StyledDiv>
          </animated.foreignObject>
        )}
      </Spring>
    )) as any;
  }

  return null;
}

export default DetailsMenu;
