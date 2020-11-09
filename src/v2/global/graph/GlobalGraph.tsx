import React from 'react';
import V1Graph from '../../../feature/global-graph/GlobalGraph';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { selectGraph } from '../../selectors/graph';

const GlobalGraph: React.FC = function () {
  const graph = useSelector(selectGraph);

  return (
    <Loading finished={graph}>{graph && <V1Graph graph={graph} />}</Loading>
  );
};

export default GlobalGraph;
