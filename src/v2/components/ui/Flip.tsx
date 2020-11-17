import { ChevronLeftIcon } from '@primer/octicons-react';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useFlatClick } from '../../../hooks/useClick';

const Base = styled.div`
  overflow: hidden;
  position: relative;
`;

const Grid = styled.div`
  transition: transform 200ms;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 100%);
`;

const Flip: React.FC = function ({ children }) {
  if (React.Children.count(children) !== 2) {
    throw new Error('Should have two childrens !');
  }
  const [drawer, setDrawer] = useState<boolean>(true);

  const click = useFlatClick(() => {
    setDrawer((s) => !s);
  });

  return (
    <Base>
      <Grid
        style={{
          transform: `translate3d(${drawer ? 0 : '-100%'}, 0, 0)`,
        }}
      >
        {children}
      </Grid>
      <DrawerHandle state={drawer} {...click} />
    </Base>
  );
};

const DrawerIcon = styled.div<{ state: boolean }>`
  z-index: 999;
  border: 1px lightgray solid;
  background-color: white;
  line-height: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  ${({ state }) =>
    state
      ? `border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;`
      : `border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;`}
  box-shadow: 1px 1px 3px lightgray;
  transform: translate(0, 0);
  transition: 2s;
  position: absolute;
  top: 50%;
  left: ${({ state }) => (state ? '100%' : '0')};
  margin-left: ${({ state }) => (state ? '-18px' : '0')};
  transition: 200ms;
`;

const Rotating = styled.div<{ state: boolean }>`
  transform: rotate(${({ state }) => (state ? '0' : '180deg')});
  transition: 200ms;
`;

const DrawerHandle: React.FC<{
  state: boolean;
  onClick: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
}> = function ({ state, ...props }) {
  return (
    <DrawerIcon
      state={state}
      {...props}
      title={state ? 'Réduire la vue générale' : 'Afficher la vue générale'}
    >
      <Rotating state={state}>
        <ChevronLeftIcon verticalAlign="middle" size="small" />
      </Rotating>
    </DrawerIcon>
  );
};
export default Flip;
