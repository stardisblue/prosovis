import React from 'react';
import styled from 'styled-components/macro';

const Grid = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  overflow: hidden;
  grid-template-columns: 1fr 3fr;
`;

const SideMainView: React.FC = function ({ children }) {
  if (React.Children.count(children) !== 2) {
    throw new Error('Should have two childrens !');
  }
  return <Grid>{children}</Grid>;
};

export default SideMainView;
