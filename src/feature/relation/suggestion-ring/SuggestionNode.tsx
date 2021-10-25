import React, { useCallback, useState } from 'react';
import { PlusIcon } from '@primer/octicons-react';
import * as d3 from 'd3';
import { identity } from 'lodash';
import { concat, groupBy, keyBy, map, mapValues, pipe } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components/macro';
import { useFlatClick } from '../../../hooks/useClick';
import { tryAddDetailActorThunk } from '../../../v2/thunks/actors';
import { ProsoVisSignedRelation } from '../../../v2/types/relations';
import Modal from '../../modal/Modal';
import { selectRelationGhosts } from '../selectRelations';
import {
  selectDisplayedActorRingLinks,
  selectIntersection,
  selectSortedGhosts,
} from './selectors';
import { darkgray } from '../../../v2/components/theme';

const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

const selectGroups = createSelector(
  selectSortedGhosts,
  selectDisplayedActorRingLinks,
  (sorted, links) =>
    pipe(
      Array.from as (v: any) => ProsoVisSignedRelation[],
      concat(sorted),
      groupBy<ProsoVisSignedRelation>('target'),
      mapValues(pipe(map('source'), keyBy(identity)))
    )(links.values())
  // _(Array.from(links.values()))
  //   .concat(sorted)
  //   .groupBy('target')
  //   .mapValues((links) => _(links).map('source').keyBy().value())
  //   .value()
);

export const SuggestionNodes: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  color: string | null | undefined;
  x: (v: string) => number;
}> = function ({ $g, color, x }) {
  const sorted = useSelector(selectSortedGhosts);
  const domain = d3.extent<number>(map('d', sorted)) as [number, number];

  const grouped = useSelector(selectGroups);
  y.domain(domain);

  return (
    <g ref={$g} fill={color ?? darkgray}>
      {sorted.map((datum) => (
        <SuggestionNode
          key={datum.target}
          datum={datum}
          x={x}
          y={y}
          actors={grouped[datum.target]}
          color={color || darkgray}
        />
      ))}
    </g>
  );
};

export const SuggestionNode: React.FC<{
  actors: _.Dictionary<string>;
  datum: ProsoVisSignedRelation;
  x: (value: string) => number;
  y: d3.ScaleLogarithmic<number, number>;
  color: string;
}> = function ({ actors, datum, x, y, color }) {
  const ghosts = useSelector(selectRelationGhosts);
  const dispatch = useDispatch();

  const active = useSelector(selectIntersection);

  const [showModal, setShow] = useState({ show: false, x: 0, y: 0 });

  const { onClick, onMouseUp } = useFlatClick((e) => {
    dispatch(tryAddDetailActorThunk(datum.target));
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      const parent: SVGGElement = (e.target as any).parentNode;
      const { top, height, left } = parent
        .querySelector('circle')!
        .getBoundingClientRect();
      setShow({ show: true, x: left, y: top + height / 2 });
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      setShow({ show: false, x: 0, y: 0 });
    },
    []
  );

  return (
    <g
      style={{
        transform: `rotate(${
          (x(datum.target) * 180) / Math.PI
        }deg) translate3d(200px, 0, 0)`,
      }}
      opacity={active ? (actors[active.actor] ? 1 : 0.3) : undefined}
      onMouseUp={onMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <circle r={5} />
      <rect x={6} y={-2.5} height={5} width={y(datum.d)}></rect>
      {showModal.show && (
        <g onClick={onClick}>
          <Modal>
            <SuggestionPopup
              x={showModal.x}
              y={showModal.y}
              color={color}
              label={ghosts.get(datum.target)?.label}
            />
          </Modal>
        </g>
      )}
      <title>{ghosts.get(datum.target)?.label}</title>
    </g>
  );
};

const AbsoluteDiv = styled.div`
  z-index: 9999;
  border-radius: 500px;
  position: absolute;
  color: white;
  background-color: white;
  cursor: pointer;
`;
const StyledDiv = styled.div`
  height: 20px;
  border-radius: 500px;
  padding-right: 0.5em;
  padding-left: 4px;
  padding-top: 2px;
  line-height: 1;
  display: flex;
`;

export const SuggestionPopup: React.FC<any> = function ({
  x,
  y,
  color,
  label,
}) {
  // const activeActors = useSelector(selectActors);
  return (
    <AbsoluteDiv
      style={{
        left: x - 5,
        top: y - 10,
      }}
    >
      <StyledDiv
        style={{
          backgroundColor: d3.color(color)?.darker().toString(),
        }}
      >
        <PlusIcon />
        <span style={{ marginLeft: '2px' }}>{label}</span>
        {/* {_.map(activeActors, (a) => (
        <ActorLine actor={a} />
      ))} */}
      </StyledDiv>
    </AbsoluteDiv>
  );
};

export default SuggestionNode;
