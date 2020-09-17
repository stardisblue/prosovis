import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Nullable } from '../data/models';
import Modal from '../feature/modal/Modal';
import { getDimensionObject } from '../hooks/useDimensions';
import { darkgray } from './ui/colors';

const PopperDiv = styled.div`
  z-index: 9999;
  position: absolute;
`;

type PopperType<T extends HTMLElement | SVGElement> = {
  content: React.ReactNode;
  offset?: {
    x: number;
    y: number;
  };
  children: (
    $ref: React.MutableRefObject<T>,
    showPopper: () => void,
    hidePopper: () => void
  ) => React.ReactNode;
};

export const Popper = function <T extends HTMLElement | SVGElement>({
  content,
  children,
  offset = { x: 0, y: 0 },
}: PopperType<T>) {
  const [dims, setDims] = useState<Nullable<{ x: number; y: number }>>(null);
  const $ref = useRef<T>(null as any);

  function showPopper() {
    const { top, left } = getDimensionObject($ref.current);
    setDims({ x: left + offset.x, y: top + offset.y });
  }

  function hidePopper() {
    setDims(null);
  }

  const positionorhide = dims
    ? {
        left: dims!.x,
        top: dims!.y,
      }
    : { display: 'none' };

  return (
    <>
      {children($ref, showPopper, hidePopper)}
      <Modal>
        <PopperDiv style={positionorhide}>{content}</PopperDiv>
      </Modal>
    </>
  );
};

export const CenteredTopPopper = function <T extends HTMLElement | SVGElement>({
  content,
  children,
}: PopperType<T>) {
  const $content = useRef<HTMLDivElement>(null as any);
  const $ref = useRef<T>(null as any);

  const [dims, setDims] = useState<{ left: number; top: number } | undefined>(
    undefined
  );

  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (show) {
      const childDims = getDimensionObject($ref.current);
      const contentDims = getDimensionObject($content.current);

      setDims({
        left: childDims.left + childDims.width / 2 - contentDims.width / 2,
        top: childDims.top - contentDims.height,
      });
    } else {
      setDims(undefined);
    }
  }, [show]);

  function showPopper() {
    setShow(true);
  }

  function hidePopper() {
    setShow(false);
  }

  const childs = useMemo(() => children($ref, showPopper, hidePopper), [
    children,
  ]);

  return (
    <>
      {childs}
      <Modal>
        <BlackPopper ref={$content} style={show ? dims : { display: 'none' }}>
          {content}
        </BlackPopper>
      </Modal>
    </>
  );
};

const BlackPopper = styled(PopperDiv)`
  background-color: ${darkgray};
  border-radius: 3px;
  color: white;
  padding: 0.5em;
  font-size: 12px;
  line-height: 1.2;
  top: 0;
`;
