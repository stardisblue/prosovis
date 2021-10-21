import React, { useEffect } from 'react';
import { SuggestionNodes } from './SuggestionNode';
import { scaleBand } from 'd3-scale';
import { SuggestionActorLinks } from './SuggestionActorLink';
import { SuggestionLinks } from './SuggestionLink';

import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectRelationEmphasis } from '../highlightSlice';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { selectSortedGhosts, selectDisplayedActorRingLinks } from './selectors';
import { map } from 'lodash/fp';

const selectActiveActorColor = createSelector(
  selectSwitchActorColor,
  selectRelationEmphasis,
  (color, emph) => {
    if (!color) return null;
    if (emph) return color(emph.actor);
  }
);

const xBand = scaleBand<string>().range([0, 2 * Math.PI]);

const x = (value: string) => xBand(value)! + (xBand.bandwidth() - Math.PI) / 2;

export const SuggestionRing: React.FC<{
  $nodes?: React.MutableRefObject<SVGGElement>;
  $links?: React.MutableRefObject<SVGGElement>;
  updateLinkPosition: React.MutableRefObject<{
    nodes: () => void;
    links: () => void;
    ringLinks: () => void;
  }>;
}> = function ({
  $links,
  updateLinkPosition,
  //   ghosts: { actorRingLinks, ghosts, ringLinks },
}) {
  const color = useSelector(selectActiveActorColor);

  const sorted = useSelector(selectSortedGhosts);
  xBand.domain(map('target', sorted));

  const actorRingLinks = useSelector(selectDisplayedActorRingLinks);
  useEffect(() => {
    if (updateLinkPosition.current) updateLinkPosition.current.ringLinks();
  }, [actorRingLinks, updateLinkPosition]);

  return (
    <g>
      <SuggestionLinks x={x} />
      <SuggestionActorLinks $g={$links} x={x} />
      <SuggestionNodes /*$g={$nodes}*/ color={color} x={x} />
    </g>
  );
};

export default SuggestionRing;
