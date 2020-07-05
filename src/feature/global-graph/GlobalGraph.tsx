import React, { useRef, useLayoutEffect, useMemo, useContext } from 'react';
import prism from './prism.json';
import _, { debounce } from 'lodash';
import * as d3 from 'd3';
import { EasyPZ } from 'easypz';
import { GlobalGraphNode } from './GlobalGraphNode';
import GlobalGraphContext, {
  useGlobalGraphContext,
} from './GlobalGraphContext';
import useDimensions from '../../hooks/useDimensions';
import DetailsMenuContext from './DetailsMenuContext';
const wx = d3.max(prism, (n) => n.x + n.width / 2)!;
const hy = d3.max(prism, (n) => n.y + n.height / 2)!;

const GlobalGraph: React.FC = function (props) {
  const context = useGlobalGraphContext();
  const { setMenuTarget } = useContext(DetailsMenuContext);

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
          setMenuTarget(undefined);
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

    const throttleSetMenu = debounce(
      () =>
        setMenuTarget((prevState) =>
          prevState !== undefined ? { ...prevState } : prevState
        ),
      100
    );

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

        throttleSetMenu();
      },
      { minScale: 1 },
      ['SIMPLE_PAN', 'WHEEL_ZOOM', 'PINCH_ZOOM']
    );

    return () => {
      easypz.removeHostListeners();
    };
  }, [bScale, handleClick, setMenuTarget]);

  return (
    <GlobalGraphContext.Provider value={context}>
      <svg
        ref={$svg}
        width="100%"
        height={dims ? dims.height - 100 : '100%'}
        viewBox={viewBox}
        onClick={handleClick}
      >
        <g ref={$nodeGroup} style={{ transform: `scale(${bScale})` }}>
          {_.map(prism, (n) => (
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
        </g>
      </svg>
    </GlobalGraphContext.Provider>
  );
};

export default GlobalGraph;
