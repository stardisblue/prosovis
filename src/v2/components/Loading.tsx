import React from 'react';
import { isNil } from 'lodash/fp';
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

const Spinner = styled.span<{ size?: number }>`
  width: ${({ size = 3 }) => size}em;
  height: ${({ size = 3 }) => size}em;
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
  overflow: hidden;
`;

const Loading: React.FC<{
  finished: any;
  size?: number;
  hide?: boolean;
  className?: string;
}> = function ({ className, finished, size = 3, children, hide = false }) {
  const loading = isNil(finished);
  return loading ? (
    <FullWidth className={className}>
      {!hide && children}
      <LoadingSplash>
        <Spinner size={size} />
      </LoadingSplash>
    </FullWidth>
  ) : (
    <>{children}</>
  );
};

export default Loading;
