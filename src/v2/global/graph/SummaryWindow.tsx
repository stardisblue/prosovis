import { get } from 'lodash/fp';
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components/macro';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { stopEventPropagation } from '../../../hooks/useClick';
import Loading from '../../components/Loading';
import { selectEventIndex } from '../../selectors/events';
import { SummaryEvents } from './SummaryEvents';
import { SummaryHeader } from './SummaryHeader';

type Coordinates = { x: number; y: number };
export const SummaryWindow: React.FC<{
  target: Coordinates & { actor: string };
}> = function ({ target: { x, y, actor } }) {
  const $ref = useRef<SVGForeignObjectElement>(null as any);

  const [{ width, height }, set] = useSpring<{ width: number; height: number }>(
    () => ({ width: 0, height: 0, reset: true })
  );

  useLayoutEffect(() => {
    set({ from: { width: 0, height: 0 }, width: 250, height: 300 });
  }, [actor, set]);

  useEffect(() => {
    /* react onWheel event is attached directly to top element event listener,
    aka: document.addEventListener
    as we don't want EasyPZ to react to wheel events in this case, we are
    forced to use legacy eventlistener, hence the effect
     */
    const rf = $ref.current;
    rf.addEventListener('wheel', stopEventPropagation);

    return () => {
      rf.removeEventListener('wheel', stopEventPropagation);
    };
  }, []);

  const eventsIndex = useSelector(selectEventIndex);
  const events = useMemo(() => get(actor, eventsIndex), [actor, eventsIndex]);

  return (
    <animated.foreignObject
      ref={$ref}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      width={width}
      height={height}
      onMouseUp={stopEventPropagation}
    >
      <Base>
        <SummaryHeader actor={actor} />
        <Loading finished={events} hide>
          <SummaryEvents events={events!} />
        </Loading>
      </Base>
    </animated.foreignObject>
  );
};

const Base = styled(StyledFlex)`
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px solid gray;
  border-radius: 3px;
  box-shadow: 0 0 3px gray;
`;
