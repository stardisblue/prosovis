import styled from 'styled-components/macro';
import React, { useContext, useMemo } from 'react';
import DetailsMenuContext from './DetailsMenuContext';
import { getDimensionObject } from '../../hooks/useDimensions';
import { Spring, animated } from 'react-spring/renderprops';
import { DetailsMenuContent } from './DetailsMenuContent';

const StyledDiv = styled.div`
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
  const { menuTarget } = useContext(DetailsMenuContext);

  const coords = useMemo(() => {
    if (menuTarget) {
      const { right: x, top: y } = getDimensionObject(menuTarget.ref);
      return [x, y];
    }
  }, [menuTarget]);

  const Div = animated(StyledDiv);

  return (menuTarget && coords && (
    <Spring
      native
      to={{
        transform: `translate3d(${coords[0]}px, ${coords[1]}px, 0)`,
      }}
    >
      {(props) => (
        <Div style={props}>
          <DetailsMenuContent actor={menuTarget.actor} />
        </Div>
      )}
    </Spring>
  )) as any;
}

export default DetailsMenu;
