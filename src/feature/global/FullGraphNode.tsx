import React from 'react';
import styled from 'styled-components/macro';

const StyledRect = styled.rect`
  fill: lightgray;
  stroke: black;
`;
const StyledText = styled.text`
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: middle;
  user-select: none;
`;

export const FullGraphNode: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}> = function ({ x, y, width, height, label }) {
  // const [coords, setCoords] = useState({ x, y });
  // useAttrTransition(d3Rect, coords);
  return (
    <g
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      <StyledRect width={width} height={height}>
        <title>{label}</title>
      </StyledRect>
      <StyledText dx={width / 2} dy={height / 2}>
        {label}
      </StyledText>
    </g>
  );
};
