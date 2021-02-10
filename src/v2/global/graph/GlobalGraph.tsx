import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { selectGraph } from '../../selectors/graph';
import { ProsoVisGraph } from '../../types/graph';
import { GraphNode } from './GraphNode';
import { useEasyPZ } from './useEasyPZ';

const GlobalGraph: React.FC = function () {
  const graph = useSelector(selectGraph);

  return <Loading finished={graph}>{graph && <Graph graph={graph} />}</Loading>;
};

const useGraphBounds = function (graph: ProsoVisGraph) {
  return useMemo(
    () =>
      graph.reduce<{
        x: number;
        y: number;
      }>(
        (acc, n) => {
          const maxX = n.x + n.width / 2;
          const maxY = n.y + n.height / 2;
          if (acc.x === null || maxX > acc.x) acc.x = maxX;
          if (acc.y === null || maxY > acc.y) acc.y = maxY;
          return acc;
        },
        { x: null, y: null } as any
      ),
    [graph]
  );
};

export const Graph: React.FC<{ graph: ProsoVisGraph }> = function ({ graph }) {
  const bounds = useGraphBounds(graph);
  const { $svg, $g, baseScale, viewBox } = useEasyPZ(bounds);

  return (
    <svg ref={$svg} width="100%" height="100%" viewBox={viewBox}>
      <g ref={$g} style={{ transform: `scale(${baseScale})` }}>
        {graph.map(({ id, x, y, ...n }) => (
          <GraphNode
            key={id}
            id={id}
            x={x - n.width / 2}
            y={y - n.height / 2}
            {...n}
          />
        ))}
      </g>
    </svg>
  );
};

export default GlobalGraph;
