import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

const Base = styled.div`
  transition: transform 200ms;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 100%);
`;

const TwoPanel: React.FC<{ flip: boolean }> = function ({ flip, children }) {
  if (React.Children.count(children) !== 2) {
    throw new Error('Should have two childrens !');
  }
  const style = { transform: `translate3d(${flip ? '-100%' : 0}, 0, 0)` };
  return <Base style={style}>{children}</Base>;
};
export default TwoPanel;
