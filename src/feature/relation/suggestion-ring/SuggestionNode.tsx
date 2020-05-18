import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import { RelationEvent } from '../models';
import { useSelector, useDispatch } from 'react-redux';
import { selectRelationGhosts } from '../selectRelations';
import {
  selectIntersection,
  selectSortedGhosts,
  selectDisplayedActorRingLinks,
} from './selectors';
import { createSelector } from 'reselect';
import { useFlatClick } from '../../../hooks/useClick';
import { selectActors } from '../../../selectors/event';
import Modal from '../../modal/Modal';
import styled from 'styled-components';
import Octicon, { X, Plus } from '@primer/octicons-react';
import { deleteActor } from '../../../reducers/eventSlice';
import { addActorThunk } from '../../../thunks/actor';

const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

const selectGroups = createSelector(
  selectSortedGhosts,
  selectDisplayedActorRingLinks,
  (sorted, links) =>
    _(Array.from(links.values()))
      .concat(sorted)
      .groupBy('target')
      .mapValues((links) => _(links).map('source').keyBy().value())
      .value()
);

export const SuggestionNodes: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  color: string | null | undefined;
  x: (v: number) => number;
}> = function ({ $g, color, x }) {
  const sorted = useSelector(selectSortedGhosts);
  const domain = d3.extent<number>(_.map(sorted, 'd')) as [number, number];

  const grouped = useSelector(selectGroups);
  y.domain(domain);

  return (
    <g ref={$g} fill={color || '#6c757d'}>
      {_.map(sorted, (datum) => (
        <SuggestionNode
          key={datum.target}
          datum={datum}
          x={x}
          y={y}
          actors={grouped[datum.target]}
          color={color || '#6c757d'}
        />
      ))}
    </g>
  );
};

export const SuggestionNode: React.FC<{
  actors: { [k: number]: number };
  datum: RelationEvent;
  x: (value: number) => number;
  y: d3.ScaleLogarithmic<number, number>;
  color: string;
}> = function ({ actors, datum, x, y, color }) {
  const ghosts = useSelector(selectRelationGhosts);
  const dispatch = useDispatch();

  const active = useSelector(selectIntersection);

  const [showModal, setShow] = useState({ show: false, x: 0, y: 0 });

  const { onClick, onMouseUp } = useFlatClick((e) => {
    dispatch(addActorThunk(datum.target));
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
      transform={`rotate(${
        (x(datum.target) * 180) / Math.PI
      }) translate(200,0)`}
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
  const activeActors = useSelector(selectActors);
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
        <Octicon icon={Plus} />
        <span style={{ marginLeft: '2px' }}>{label}</span>
        {/* {_.map(activeActors, (a) => (
        <ActorLine actor={a} />
      ))} */}
      </StyledDiv>
    </AbsoluteDiv>
  );
};
export const ActorLine: React.FC<any> = function ({ actor }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(deleteActor(actor.id));
  }, [dispatch, actor.id]);

  return (
    <div>
      <span className="pointer" onClick={handleClick}>
        <Octicon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          icon={X}
          ariaLabel={'Supprimer'}
        />
      </span>
      {actor.label}
    </div>
  );
};

export default SuggestionNode;
