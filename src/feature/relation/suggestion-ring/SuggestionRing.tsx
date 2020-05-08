import React, { useEffect } from 'react';
import { SuggestionNodes } from './SuggestionNode';
import { scalePoint } from 'd3-scale';
import { SuggestionActorLinks } from './SuggestionActorLink';
import { SuggestionLinks } from './SuggestionLink';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { selectSelectedGhosts } from '../selectionSlice';
import {
  selectHighlightedGhosts,
  selectRelationEmphasis,
} from '../highlightSlice';
import { selectSwitchActorColor } from '../../../selectors/switch';

const selectDisplayedRing = createSelector(
  selectSelectedGhosts,
  selectHighlightedGhosts,
  (sel, high) => (sel.ghosts.size > 0 ? sel : high)
);

const selectActiveActorColor = createSelector(
  selectSwitchActorColor,
  selectRelationEmphasis,
  (color, emph) => {
    if (!color) return null;
    if (emph) return color(emph.actor);
  }
);

const x = scalePoint<number>().range([0, 2 * Math.PI]);

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

  const { ghosts, ringLinks, actorRingLinks } = useSelector(
    selectDisplayedRing
  );

  useEffect(() => {
    if (updateLinkPosition.current) updateLinkPosition.current.ringLinks();
  }, [actorRingLinks, updateLinkPosition]);

  const sorted = _.orderBy(Array.from(ghosts.values()), ['med', 'd']);
  x.domain(_.map(sorted, 'target'));

  return (
    <g>
      <SuggestionLinks links={ringLinks} x={x} />
      <SuggestionActorLinks
        $g={$links}
        nodes={sorted}
        links={actorRingLinks}
        x={x}
      />
      <SuggestionNodes /*$g={$nodes}*/ color={color} sorted={sorted} x={x} />
    </g>
  );
};

export default SuggestionRing;
