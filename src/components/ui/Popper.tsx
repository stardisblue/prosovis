import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import Modal from '../../feature/modal/Modal';
import { getDimensionObject } from '../../hooks/useDimensions';
import { darkgray } from './colors';

type PopperType<T extends HTMLElement | SVGElement> = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  content: React.ReactNode;
  offset?: {
    x: number;
    y: number;
  };
  position?: 'north' | 'north-west';
  children: (
    $ref: React.MutableRefObject<T>,
    showPopper: () => void,
    hidePopper: () => void
  ) => React.ReactNode;
};

function computePosition(
  child: DOMRect,
  content: DOMRect,
  orientation: NonNullable<PopperType<HTMLElement>['position']>
) {
  if (orientation === 'north')
    return {
      left: child.left + child.width / 2 - content.width / 2,
      top: child.top - content.height,
    };

  if (orientation === 'north-west')
    return {
      left: child.right,
      top: child.top - 4,
    };
}

export function useRefPopper<T extends HTMLElement | SVGElement>(
  content: React.ReactNode,
  position: PopperType<HTMLElement>['position'] = 'north',
  StyledPopper:
    | keyof JSX.IntrinsicElements
    | React.ComponentType<any> = BlackPopper
): [React.ReactNode, React.MutableRefObject<T>, () => void, () => void] {
  const $ref = useRef<T>(null as any);

  const [jsxcontent, show, hide] = usePopper(
    $ref,
    content,
    position,
    StyledPopper
  );
  return [jsxcontent, $ref, show, hide];
}

export function useDimsPopper<
  T extends HTMLElement | SVGElement,
  C extends HTMLElement | SVGElement
>(
  $ref: React.MutableRefObject<T>,
  $content: React.MutableRefObject<C>,
  position: PopperType<HTMLElement>['position'] = 'north'
): [
  { left: number; top: number } | { display: 'none' } | undefined,
  () => void,
  () => void
] {
  const [show, setShow] = useState(false);
  const [dims, setDims] = useState<{ left: number; top: number } | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    if (show) {
      const childDims = getDimensionObject($ref.current);
      const contentDims = getDimensionObject($content.current);

      setDims(computePosition(childDims, contentDims, position));
    } else {
      setDims(undefined);
    }
  }, [show, position, $ref, $content]);

  return [show ? dims : { display: 'none' }, showPopper, hidePopper];

  function showPopper() {
    setShow(true);
  }

  function hidePopper() {
    setShow(false);
  }
}

export function usePopper<T extends HTMLElement | SVGElement>(
  $ref: React.MutableRefObject<T>,
  content: React.ReactNode,
  position: PopperType<HTMLElement>['position'] = 'north',
  StyledPopper:
    | keyof JSX.IntrinsicElements
    | React.ComponentType<any> = BlackPopper
): [React.ReactNode, () => void, () => void] {
  const $content = useRef<HTMLDivElement>(null as any);

  const [show, setShow] = useState(false);
  const [dims, setDims] = useState<{ left: number; top: number } | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    if (show) {
      const childDims = getDimensionObject($ref.current);
      const contentDims = getDimensionObject($content.current);

      setDims(computePosition(childDims, contentDims, position));
    } else {
      setDims(undefined);
    }
  }, [show, position, $ref]);

  return [
    <Modal>
      <StyledPopper ref={$content} style={show ? dims : { display: 'none' }}>
        {content}
      </StyledPopper>
    </Modal>,
    showPopper,
    hidePopper,
  ];

  function showPopper() {
    setShow(true);
  }

  function hidePopper() {
    setShow(false);
  }
}

export const Popper = function <T extends HTMLElement | SVGElement>({
  as = BlackPopper,
  content,
  children,
  position = 'north',
}: PopperType<T>) {
  const [jsxcontent, $ref, show, hide] = useRefPopper<T>(content, position, as);

  return (
    <>
      {children($ref, show, hide)}
      {jsxcontent}
    </>
  );
};

const BlackPopper = styled.div`
  z-index: 9999;
  position: absolute;
  background-color: ${darkgray};
  border-radius: 3px;
  color: white;
  padding: 0.5em;
  font-size: 12px;
  line-height: 1.2;
  top: 0;
`;
