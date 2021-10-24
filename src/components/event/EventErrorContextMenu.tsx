import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { ProsoVisError } from '../../v2/types/errors';
import { IconSpacer, IconSpacerPointer } from '../ui/IconSpacer';
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GrabberIcon,
} from '@primer/octicons-react';
import { sortBy, pipe, capitalize } from 'lodash/fp';
import { useDimsPopper } from '../ui/Popper';
import { stopEventPropagation, useFlatClick } from '../../hooks/useClick';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Modal from '../../feature/modal/Modal';
import styled from 'styled-components/macro';
import { darkgray } from '../ui/colors';

const errorLevelTranslation: { [k in ProsoVisError['level']]: string } = {
  Error: 'erreur',
  Warning: 'alerte',
  Info: 'note',
};

function getErrorLevel(error: ProsoVisError) {
  return errorLevelTranslation[error.level];
}

const createErrorTitleString = pipe(getErrorLevel, capitalize);

const ErrorTitle = styled.div`
  align-self: center;
  padding-left: 1em;
`;

const TabButton = styled(IconSpacer)`
  background-color: #fafbfc;
  border: 1px solid rgba(27, 31, 35, 0.12);
  box-shadow: 0px 1px 0px rgba(27, 31, 35, 0.04),
    inset 0px 2px 0px rgba(255, 255, 255, 0.25);
  padding: 0.25em;
`;

const GroupableTabButton = styled(TabButton)<{
  position?: 'left' | 'right' | 'between';
  disabled?: boolean;
}>`
  ${({ position }) => {
    switch (position) {
      case 'left':
        return `
          border-top-left-radius: 4px; 
          border-bottom-left-radius: 4px;
          border-right-width: 0;`;
      case 'right':
        return `
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;`;
      case 'between':
        return 'border-right-width: 0;';
      default:
        return '';
    }
  }}
`;

const TitleBase = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto 1fr auto;
  padding-top: 0.25em;
  padding-left: 0.25em;
`;

const TitleCloseIcon = styled(IconSpacerPointer)`
  align-self: start;
`;

const CountDisplay = styled.div`
  padding: 0.25em;
  border-top: 1px solid rgba(27, 31, 35, 0.12);
  border-bottom: 1px solid rgba(27, 31, 35, 0.12);
  border-left: 1px solid rgba(27, 31, 35, 0.12);
  box-shadow: 0px 1px 0px rgba(27, 31, 35, 0.04),
    inset 0px 2px 0px rgba(255, 255, 255, 0.25);
`;

const ContentBase = styled.div`
  padding: 0.25em;
`;

const ContentTitle = styled.p`
  text-align: center;
`;

const DetailsMenuContent: React.FC<{ error: ProsoVisError }> = function ({
  error,
}) {
  return (
    <ContentBase>
      <ContentTitle>{error.message}</ContentTitle>
    </ContentBase>
  );
};

function translateInterpolator(x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0)`;
}

const Overlay = styled.div<{ show?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
`;
const DetailsMenu = styled.div<{ active?: boolean }>`
  z-index: 9998;
  top: 0;
  position: absolute;
  width: 20em;
  min-height: 200px;
  background-color: white;
  box-shadow: 1px 1px 5px ${({ active }) => (active ? '2px' : '0')} ${darkgray};
  border-radius: 3px;
  pointer-events: auto;
  transition: box-shadow 300ms ease;
`;

const AnimatedDetailsMenu = animated(DetailsMenu);

const DraggableIcon = styled(IconSpacer)`
  cursor: grab;
  padding-left: 0.25em;
  padding-right: 0.25em;
`;

export const EventErrorContextMenu: React.FC<{
  errors: ProsoVisError[];
  highlight: boolean;
  $parentRef: React.MutableRefObject<HTMLElement>;
  close: () => void;
}> = function ({ highlight, errors, $parentRef, close }) {
  const [active, setActive] = useState(false);

  const [{ xy }, set] = useSpring(
    () =>
      ({
        xy: [0, 0],
      } as { xy: [number, number] })
  );

  const bindDraggable = useDrag(({ down, offset }) => {
    setActive(down);
    set({ xy: offset });
  });

  const $contentRef = useRef<HTMLDivElement>(null as any);
  const [dims, show, hide] = useDimsPopper(
    $parentRef,
    $contentRef,
    'north-east'
  );

  useEffect(() => {
    show();

    return () => {
      hide();
    };
    // eslint-disable-next-line
  }, []);

  const sortedErrors = useMemo(
    () =>
      sortBy(({ level }) => {
        return level === 'Error' ? 0 : level === 'Warning' ? 1 : 2;
      }, errors),
    [errors]
  );

  const [[currentErrorIndex, currentError], setCurrentError] = useState<
    [number, ProsoVisError]
  >([0, sortedErrors[0]]);

  const next = useCallback(() => {
    if (currentErrorIndex + 1 < sortedErrors.length) {
      setCurrentError([
        currentErrorIndex + 1,
        sortedErrors[currentErrorIndex + 1],
      ]);
    }
  }, [sortedErrors, currentErrorIndex]);

  const prev = useCallback(() => {
    if (currentErrorIndex > 0) {
      setCurrentError([
        currentErrorIndex - 1,
        sortedErrors[currentErrorIndex - 1],
      ]);
    }
  }, [sortedErrors, currentErrorIndex]);

  return (
    <Modal>
      <Overlay show={active}>
        <AnimatedDetailsMenu
          active={highlight}
          ref={$contentRef}
          onClick={stopEventPropagation}
          onMouseUp={stopEventPropagation}
          onContextMenu={stopEventPropagation}
          style={{
            ...dims,
            transform: xy.interpolate(translateInterpolator as any),
          }}
        >
          <TitleBase>
            <DraggableIcon {...bindDraggable()}>
              <GrabberIcon />
            </DraggableIcon>
            <GroupableTabButton
              as="button"
              position="left"
              onClick={prev}
              disabled={currentErrorIndex === 0}
            >
              <ChevronLeftIcon />
            </GroupableTabButton>
            <CountDisplay>
              {currentErrorIndex + 1}/{sortedErrors.length}
            </CountDisplay>
            <GroupableTabButton
              as="button"
              position="right"
              onClick={next}
              disabled={currentErrorIndex + 1 === sortedErrors.length}
            >
              <ChevronRightIcon />
            </GroupableTabButton>
            <ErrorTitle>{createErrorTitleString(currentError)}</ErrorTitle>
            <TitleCloseIcon spaceRight {...useFlatClick(close)}>
              <XIcon aria-label="Fermer le menu contextuel d'erreur" />
            </TitleCloseIcon>
          </TitleBase>
          <DetailsMenuContent error={currentError} />
        </AnimatedDetailsMenu>
      </Overlay>
    </Modal>
  );
};
