import * as d3 from 'd3-force';

export function getSimulation(getId: (d: any) => any) {
  return (
    d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-300))
      .force('link', d3.forceLink().id(getId).distance(100))
      // .force('center', d3.forceCenter())
      .force('x', d3.forceX())
      .force('y', d3.forceY())
  );
}
