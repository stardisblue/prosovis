import React, { useState, useEffect } from 'react';
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

/**
 *
 * @param param0
 * @deprecated
 */
const Drawer: React.FC<{
  className?: string;
  hideable?: React.ReactNode;
}> = function ({ className, hideable, children }) {
  const [drawer, setDrawer] = useState<'open' | 'closed'>('open');

  const click = useFlatClick(() => {
    setDrawer((state) => (state === 'open' ? 'closed' : 'open'));
  });

  const [display, setDisplay] = useState<'none' | undefined>();
  useEffect(() => {
    if (drawer === 'open') {
      const t = setTimeout(() => setDisplay(undefined), 250);
      return () => clearTimeout(t);
    } else {
      setDisplay('none');
    }
  }, [drawer]);

  return (
    <StyledDrawer
      className={className}
      style={{ width: drawer === 'open' ? '100%' : '0' }}
    >
      {drawer === 'open' && hideable}
      <div
        style={{
          display: display,
          height: '100%',
        }}
      >
        {children}
      </div>
      <DrawerHandle state={drawer} {...click} />
    </StyledDrawer>
  );
};

const DrawerIcon = styled.div<{ state: 'open' | 'closed' }>`
  z-index: 999;
  border: 1px lightgray solid;
  background-color: white;
  line-height: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  ${({ state }) =>
    state === 'closed'
      ? `border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;`
      : `border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;`}
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
