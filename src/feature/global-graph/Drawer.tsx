import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@primer/octicons-react';
import styled from 'styled-components/macro';
import { useFlatClick } from '../../hooks/useClick';

const StyledDrawer = styled.section`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 9998;
  transition-duration: 0.25s;
  background-color: white;
  border-left: 1px solid lightgray;
`;

const Drawer: React.FC<{
  className?: string;
  hideable?: React.ReactNode;
}> = function ({ className, hideable, children }) {
  const [drawer, setDrawer] = useState<'open' | 'closed'>('open');

  const click = useFlatClick(() => {
    setDrawer((state) => (state === 'open' ? 'closed' : 'open'));
  });

  return (
    <StyledDrawer
      className={className}
      style={{ width: drawer === 'open' ? '100%' : '0' }}
    >
      {drawer === 'open' && hideable}
      {children}
      <DrawerHandle state={drawer} {...click} />
    </StyledDrawer>
  );
};

const DrawerIcon = styled.div<{ state: 'open' | 'closed' }>`
  border: 1px lightgray solid;
  background-color: white;
  line-height: 0;
  padding-top: 10px;
  padding-bottom: 10px; 
  border-top-${({ state }) =>
    state === 'closed' ? 'right' : 'left'}-radius: 10px;
  border-bottom-${({ state }) =>
    state === 'closed' ? 'right' : 'left'}-radius: 10px;
  box-shadow: 1px 1px 3px lightgray;
  ${({ state }) => state === 'open' && 'margin-left: -16px;'}
  position: absolute;
  top: 50%; 
  ${({ state }) => (state === 'closed' ? 'left' : 'right')}: 0;
`;

const DrawerHandle: React.FC<{
  state: 'open' | 'closed';
  onClick: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
}> = function ({ state, ...props }) {
  return (
    <DrawerIcon
      state={state}
      {...props}
      title={
        state === 'open'
          ? 'Réduire la vue générale'
          : 'Afficher la vue générale'
      }
    >
      {state === 'open' ? (
        <ChevronLeftIcon verticalAlign="middle" size="small" />
      ) : (
        <ChevronRightIcon verticalAlign="middle" size="small" />
      )}
    </DrawerIcon>
  );
};

export default Drawer;
