import React from 'react';
import { StyledFlex } from './ui/Flex/styled-components';
import styled from 'styled-components/macro';
import { ScaledDownImg } from './ScaledDownImg';

const FixedHeightFlex = styled(StyledFlex)`
  justify-content: space-between;
  width: 100%;

  & > * {
    width: 4em;
  }
`;

export const Organisms: React.FC = function () {
  return (
    <FixedHeightFlex>
      <ScaledDownImg src="./img/cnrs.png" alt="Logo CNRS" />
      <ScaledDownImg src="./img/lirmm.png" alt="Logo LIRMM" />
      <ScaledDownImg src="./img/um.png" alt="Logo Université de Montpellier" />
      <ScaledDownImg src="./img/um3.png" alt="Logo Université Paul Valery" />
      <ScaledDownImg
        src="./img/anr.jpg"
        alt="Logo Agence Nationale de la Recherche"
      />
    </FixedHeightFlex>
  );
};
