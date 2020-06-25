import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import prism from './prism.json';
import _ from 'lodash';
import * as d3 from 'd3';
import { EasyPZ } from 'easypz';
import { GlobalGraphNode } from './GlobalGraphNode';
import GlobalGraphContext, {
  useGlobalGraphContext,
} from './GlobalGraphContext';

function getDimensionObject(node: HTMLElement) {
  const rect: any = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
  };
}

const useDimensions = <T extends HTMLElement>(
  ref: React.MutableRefObject<T>
) => {
  const [dims, setDims] = useState(() => {
    if (ref.current) {
      return getDimensionObject(ref.current);
    } else {
      return null;
    }
  });

  useLayoutEffect(() => {
    if (ref.current) {
      setDims(getDimensionObject(ref.current));
    }
  }, [ref]);

  return dims;
};

const wx = d3.max(prism, (n) => n.x + n.width / 2)!;
const hy = d3.max(prism, (n) => n.y + n.height / 2)!;

const GlobalGraph: React.FC = function (props) {
  const $svg = useRef<SVGSVGElement>(null as any);
  const context = useGlobalGraphContext();

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
        }
      },
      {
        cancel: () => {
          flag = false;
        },
      }
    );
  }, [setSparker, setShiner]);

  useLayoutEffect(() => {
    const childrens = d3.select($svg.current).selectAll((_, i, nodes) => {
      return nodes[i].children;
    });

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
      { minScale: 1 }
    );

    return () => {
      easypz.removeHostListeners();
    };
  }, [bScale, handleClick]);

  return (
    <GlobalGraphContext.Provider value={context}>
      <svg
        ref={$svg}
        width="100%"
        height={dims ? dims.height - 100 : '100%'}
        viewBox={viewBox}
        onClick={handleClick}
      >
        <g style={{ transform: `scale(${bScale})` }}>
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
