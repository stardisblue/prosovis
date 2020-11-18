import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { useFlatClick } from '../../../hooks/useClick';
import theme from '../theme';

const Base = styled.div`
  overflow: hidden;
  position: relative;
`;

const W200 = styled.div`
  transition: transform ${theme.animation};
  width: 200%;
  height: 100%;
`;

const Grid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 50%);
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
      <W200
        style={{
          transform: `translate3d(${drawer ? 0 : '-50%'}, 0, 0)`,
        }}
      >
        <Grid>{children}</Grid>
        <DrawerHandle {...click} />
      </W200>
    </Base>
  );
};

const DrawerIcon = styled.div`
  z-index: 999;
  border: 1px lightgray solid;
  background-color: white;
  line-height: 0;
  padding: 10px 0;
  border-radius: 10px;
  box-shadow: 1px 1px 3px lightgray;
  position: absolute;
  display: flex;
  top: 50%;
  left: calc(50% - 25px);
`;

const DrawerHandle: React.FC<{
  onClick: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
}> = function ({ ...props }) {
  return (
    <DrawerIcon {...props}>
      <IconSpacerPointer
        as="span"
        spaceLeft
        spaceRight
        title="Réduire la vue générale"
      >
        <ChevronLeftIcon verticalAlign="middle" size="small" />
      </IconSpacerPointer>
      <IconSpacerPointer
        as="span"
        spaceLeft
        spaceRight
        title="Afficher la vue générale"
      >
        <ChevronRightIcon verticalAlign="middle" size="small" />
      </IconSpacerPointer>
    </DrawerIcon>
  );
};
export default Flip;
