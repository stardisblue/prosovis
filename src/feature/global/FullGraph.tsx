import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import prism from './prism.json';
import _ from 'lodash';
import * as d3 from 'd3';
import { EasyPZ } from 'easypz';
import { FullGraphNode } from './FullGraphNode';

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

const wx = d3.max(prism.nodes, (n) => n.x + n.width / 2)!;
const hy = d3.max(prism.nodes, (n) => n.y + n.height / 2)!;

const FullGraph: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const easypz = useRef(null as any);

  const dimensions = useDimensions($svg as any);

  const baseScale = useMemo(() => {
    if (dimensions) return (dimensions.width - dimensions.width / 10) / wx;
    return 1;
  }, [dimensions]);

  const viewBox = useMemo(() => {
    if (dimensions) {
      return [-dimensions.width / 20, 0, dimensions.width, baseScale * hy].join(
        ','
      );
    }
  }, [dimensions, baseScale]);

  useLayoutEffect(() => {
    const childrens = d3.select($svg.current).selectAll((_, i, nodes) => {
      return nodes[i].children;
    });

    easypz.current = new EasyPZ($svg.current, function (transform: any) {
      childrens.style(
        'transform',
        `translate3d(${transform.translateX}px, ${
          transform.translateY
        }px, 0) scale(${transform.scale * baseScale})`
      );
    });

    return () => {
      easypz.current.removeHostListeners();
    };
  }, [baseScale]);

  return (
    <>
      <svg ref={$svg} width="100%" height="100%" viewBox={viewBox}>
        <g style={{ transform: `scale(${baseScale})` }}>
          {_.map(prism.nodes, (n) => (
            <FullGraphNode
              key={n.index}
              x={n.x - n.width / 2}
              y={n.y - n.height / 2}
              width={n.width}
              height={n.height}
              label={n.label}
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default FullGraph;
