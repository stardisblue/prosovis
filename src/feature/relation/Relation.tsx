import React from 'react';
import * as d3 from 'd3';

export class Relation extends React.Component {
  svg = React.createRef<SVGSVGElement>();
  $svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = null as any;

  componentDidMount() {
    this.$svg = d3.select(this.svg.current!);
  }

  render() {
    return <svg ref={this.svg} width="100%" height="100%"></svg>;
  }
}

export default Relation;
