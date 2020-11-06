import React from 'react';
import styled from 'styled-components/macro';

export const Timeline = styled.div`
  height: 200px;
`;

const GlobalTimeline: React.FC = function () {
  return (
    <div>
      <h3>WIP Timeline</h3>
      <Timeline></Timeline>
    </div>
  );
};
export default GlobalTimeline;
