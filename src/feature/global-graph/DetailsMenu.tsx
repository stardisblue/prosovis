import styled from 'styled-components/macro';
import React, { useContext, useRef, useEffect } from 'react';
import DetailsMenuContext from './DetailsMenuContext';
import { Spring, animated } from 'react-spring/renderprops';
import { DetailsMenuContent } from './DetailsMenuContent';
import { stopEventPropagation } from '../../hooks/useClick';
import { Ressource } from '../../data';

const StyledDetailsOnWheelDiv = styled(DetailsOnWheelDiv)`
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

function DetailsOnWheelDiv({
  actor,
  className,
}: {
  actor: Ressource;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null as any);

  useEffect(() => {
    /* react onWheel event is attached directly to top element event listener, 
    aka: document.addEventListeners
    as we don't want EasyPZ to react to wheel events in this case, we are
    forced to use legacy eventlistener, hence the effect
     */
    const rf = ref.current;
    rf.addEventListener('wheel', stopEventPropagation);

    return () => {
      rf.removeEventListener('wheel', stopEventPropagation);
    };
  }, []);

  return (
    <div className={className} ref={ref}>
      <DetailsMenuContent actor={actor} />
    </div>
  );
}

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
          >
            <StyledDetailsOnWheelDiv actor={menuTarget.actor} />
          </animated.foreignObject>
        )}
      </Spring>
    )) as any;
  }

  return null;
}

export default DetailsMenu;
