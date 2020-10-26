import React, { useRef, useLayoutEffect, useMemo } from 'react';
import prism from '../../data/graph.json';
import { map } from 'lodash';
import * as d3 from 'd3';
import { EasyPZ } from 'easypz';
import { GlobalGraphNode } from './GlobalGraphNode';
import GlobalGraphContext, {
  useGlobalGraphContext,
} from './GlobalGraphContext';
import useDimensions from '../../hooks/useDimensions';
import DetailsMenuContext, {
  useDetailsMenuContext,
} from './DetailsMenuContext';
import DetailsMenu from './DetailsMenu';
const wx = d3.max(prism, (n) => n.x + n.width / 2)!;
const hy = d3.max(prism, (n) => n.y + n.height / 2)!;

const GlobalGraph: React.FC = function (props) {
  const context = useGlobalGraphContext();
  const detailsMenu = useDetailsMenuContext();
  const { setMenuTarget } = detailsMenu;

  const $svg = useRef<SVGSVGElement>(null as any);
  const $nodeGroup = useRef<SVGGElement>(null as any);

  const dims = useDimensions($svg as any);

  const bScale = useMemo(
    () => (dims ? (dims.width - dims.width / 10) / wx : 1),
    [dims]
  );

  const viewBox = useMemo(
    () =>
      dims
        ? [-dims.width / 20, 0, dims.width, bScale * hy - 100].join(',')
        : undefined,
    [dims, bScale]
  );

  const { setSparker, setShiner } = context;
  const handleClick = useMemo(() => {
    let flag = true;
    return Object.assign(
      (e: any) => {
        if (flag === false) {
          flag = true;
        } else {
          setSparker(null);
          setShiner(null);
          setMenuTarget(null);
        }
      },
      {
        cancel: () => {
          flag = false;
        },
      }
    );
  }, [setSparker, setShiner, setMenuTarget]);

  useLayoutEffect(() => {
    const childrens = d3.select($nodeGroup.current);

    const easypz = new EasyPZ(
      $svg.current,
      function (transform) {
        handleClick.cancel();
        childrens.style(
          'transform',
          `translate3d(${transform.translateX}px, ${
            transform.translateY
          }px, 0) scale(${transform.scale * bScale})`
        );
      },
      { minScale: 1 },
      ['SIMPLE_PAN', 'WHEEL_ZOOM', 'PINCH_ZOOM']
    );

    return () => {
      easypz.removeHostListeners();
    };
  }, [bScale, handleClick]);

  return (
    <GlobalGraphContext.Provider value={context}>
      <DetailsMenuContext.Provider value={detailsMenu}>
        <svg
          ref={$svg}
          width="100%"
          height={'100%'}
          viewBox={viewBox}
          onClick={handleClick}
        >
          <g ref={$nodeGroup} style={{ transform: `scale(${bScale})` }}>
            {map(prism, (n) => (
              <GlobalGraphNode
                key={n.index}
                id={n.index}
                x={n.x - n.width / 2}
                y={n.y - n.height / 2}
                width={n.width}
                height={n.height}
                label={n.label}
              />
            ))}
            <DetailsMenu />
          </g>
        </svg>
      </DetailsMenuContext.Provider>
    </GlobalGraphContext.Provider>
  );
};

export default GlobalGraph;
