import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

const LoadingSplash = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 500; /* higher than leaflet */
`;

const rotate = keyframes`{
    to { transform: rotate(360deg); }
  }`;

const Spinner = styled.span`
  width: 3em;
  height: 3em;
  vertical-align: text-bottom;
  border: 0.25em solid white;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${rotate} 0.75s linear infinite;
`;

const FullWidth = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Loading: React.FC<{ finished?: any }> = function ({
  finished = false,
  children,
}) {
  return (
    <FullWidth>
      {children}
      {!finished && (
        <LoadingSplash>
          <Spinner />
        </LoadingSplash>
      )}
    </FullWidth>
  );
};

export default Loading;
