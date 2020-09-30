import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacerPointer, IconSpacer } from '../ui/IconSpacer';
import {
  IconProps,
  XCircleFillIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GrabberIcon,
} from '@primer/octicons-react';
import { compact, groupBy, capitalize, pipe, sortBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled, { StyledComponent } from 'styled-components/macro';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';
import { usePopper, useRefPopper, useDimsPopper } from '../ui/Popper';
import { stopEventPropagation, useFlatClick } from '../../hooks/useClick';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Modal from '../../feature/modal/Modal';

const SipErrorIcon = styled(XCircleFillIcon)`
  color: ${red};
`;
const SipWarningIcon = styled(AlertFillIcon)`
  color: ${orange};
`;
const SipInfoIcon = styled(InfoFillIcon)`
  color: ${blue};
`;

const DetailsMenu = styled.div`
  z-index: 9998;
  position: absolute;
  width: 20em;
  min-height: 200px;
  background-color: white;
  box-shadow: 1px 1px 5px 0 black;
  border-radius: 3px;
`;

function plural(value: number, singular: string, plural: string) {
  if (value === 0) return '';

  if (value === 1) return singular;
  else return `${value} ${plural}`;
}

const errorLevelTranslation: { [k in SipError['level']]: string } = {
  Error: 'erreur',
  Warning: 'alerte',
  Info: 'note',
};

function getErrorLevel(error: SipError) {
  return errorLevelTranslation[error.level];
}

function getErrorLabel(errors: { [k in SipError['level']]?: SipError[] }) {
  return compact([
    plural(errors.Error?.length || 0, '1 erreur', 'erreurs'),
    plural(errors.Warning?.length || 0, '1 alerte', 'alertes'),
    plural(errors.Info?.length || 0, '1 note', 'notes'),
  ]).join(', ');
}

const createErrorTitleString = pipe(getErrorLevel, capitalize);

function getErrorInfo(
  errors: SipError[]
): [StyledComponent<React.FC<IconProps>, any, {}, never>, string, string] {
  const groupedErrors: { [k in SipError['level']]?: SipError[] } = groupBy(
    'level',
    errors
  );
  const label = getErrorLabel(groupedErrors);

  if (groupedErrors.Error) return [SipErrorIcon, red, label];
  if (groupedErrors.Warning) return [SipWarningIcon, orange, label];
  if (groupedErrors.Info) return [SipInfoIcon, blue, label];

  throw new Error('Unreachable code');
}

// /**
//  * @param errors
//  * @deprecated use simple string instead
//  */
// function getRichErrorLabel(
//   errors: { [k in SipError['level']]?: SipError[] }
// ) {
//   const acc: (JSX.Element | number | string)[] = [];
//   if (errors.Error)
//     acc.push(<IconSpacer as={XCircleIcon} spaceRight />, errors.Error.length);
//   if (errors.Warning)
//     acc.push(
//       <IconSpacer as={AlertIcon} spaceLeft={acc.length > 0} spaceRight />,
//       errors.Warning.length
//     );
//   if (errors.Info)
//     acc.push(
//       <IconSpacer as={InfoIcon} spaceLeft={acc.length > 0} spaceRight />,
//       errors.Info.length
//     );

//   return <StyledFlex>{acc}</StyledFlex>;
// }

const PilledIconSpacer = styled(IconSpacerPointer)`
  position: relative;
  &:before {
    content: attr(data-count);
    border-radius: 999px;
    line-height: 1;
    font-size: 10px;
    height: 11px;
    min-width: 11px;
    position: absolute;
    display: inline-block;
    top: -20%;
    right: -20%;
    color: white;
    text-align: center;
    padding: 0 2px;
  }
`;

const ColoredPilledIconSpacer = styled(PilledIconSpacer)<{ color: string }>`
  &:before {
    background-color: ${({ color }) => color};
  }
`;

export const SimpleEventErrors: React.FC<{ errors: SipError[] }> = function ({
  errors,
}) {
  const [Icon, color, label] = getErrorInfo(errors);

  const [hint, $ref, showHint, hideHint] = useRefPopper<HTMLDivElement>(label);

  return (
    <>
      <ColoredPilledIconSpacer
        spaceLeft
        ref={$ref}
        onMouseEnter={showHint}
        onFocus={showHint}
        onMouseLeave={hideHint}
        onBlur={hideHint}
        color={color}
        data-count={errors.length}
      >
        <Icon aria-label={label} />
      </ColoredPilledIconSpacer>
      {hint}
    </>
  );
};

const ErrorCount = styled.div`
  align-self: center;
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
  justify-items: center;
`;

const CountDisplay = styled.div`
  padding: 0.25em;
  border-top: 1px solid rgba(27, 31, 35, 0.12);
  border-bottom: 1px solid rgba(27, 31, 35, 0.12);
  box-shadow: 0px 1px 0px rgba(27, 31, 35, 0.04),
    inset 0px 2px 0px rgba(255, 255, 255, 0.25);
`;

const TitleCloseIcon = styled(IconSpacerPointer)`
  align-self: start;
`;

const ContentBase = styled.div`
  padding: 0.25em;
`;

const ContentTitle = styled.p`
  text-align: center;
`;

const DetailsMenuContent: React.FC<{ error: SipError }> = function ({ error }) {
  console.log(error);
  return (
    <ContentBase>
      <ContentTitle>{error.message}</ContentTitle>
    </ContentBase>
  );
};

const AnimatedDetailsMenu = animated(DetailsMenu);

export const EventErrors: React.FC<{ errors: SipError[] }> = function ({
  errors,
}) {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));

  const bindDraggable = useDrag(({ down, offset }) => {
    set({ xy: offset });
  });

  const $ref = useRef<HTMLDivElement>(null as any);

  const [showContextMenu, setContextMenuState] = useState(false);

  const sortedErrors = useMemo(
    () =>
      sortBy(
        ({ level }) => (level === 'Error' ? 0 : level === 'Warning' ? 1 : 2),
        errors
      ),
    [errors]
  );
  const [[currentErrorIndex, currentError], setCurrentError] = useState<
    [number, SipError]
  >([0, sortedErrors[0]]);

  const nextError = useCallback(() => {
    if (currentErrorIndex + 1 < sortedErrors.length) {
      setCurrentError([
        currentErrorIndex + 1,
        sortedErrors[currentErrorIndex + 1],
      ]);
    }
  }, [sortedErrors, currentErrorIndex]);

  const prevError = useCallback(() => {
    if (currentErrorIndex > 0) {
      setCurrentError([
        currentErrorIndex - 1,
        sortedErrors[currentErrorIndex - 1],
      ]);
    }
  }, [sortedErrors, currentErrorIndex]);

  const $contentRef = useRef<HTMLDivElement>(null as any);
  const [dims, showDetails, hideDetails] = useDimsPopper(
    $ref,
    $contentRef,
    'north-west'
  );

  useEffect(() => {
    if (showContextMenu) {
      showDetails();
    } else {
      hideDetails();
    }
  }, [showContextMenu, showDetails, hideDetails]);

  const [Icon, color, label] = useMemo(() => getErrorInfo(errors), [errors]);
  const [hint, showHint, hideHint] = usePopper($ref, label);

  return (
    <>
      <ColoredPilledIconSpacer
        spaceLeft
        color={color}
        data-count={errors.length}
        ref={$ref}
        onMouseEnter={showHint}
        onFocus={showHint}
        onMouseLeave={() => {
          hideHint();
        }}
        onBlur={hideHint}
        onContextMenu={handleContextMenu}
        onClick={handleContextMenu}
        onMouseUp={stopEventPropagation}
      >
        <Icon aria-label={label} />
        <Modal>
          <AnimatedDetailsMenu
            ref={$contentRef}
            onClick={stopEventPropagation}
            onMouseUp={stopEventPropagation}
            onContextMenu={stopEventPropagation}
            style={{
              ...dims,
              transform: xy.interpolate(((x: any, y: any) => {
                return `translate3d(${x}px, ${y}px, 0)`;
              }) as any),
            }}
          >
            <TitleBase>
              <IconSpacer {...bindDraggable()}>
                <GrabberIcon />
              </IconSpacer>
              <GroupableTabButton
                as="button"
                position="left"
                onClick={prevError}
                disabled={currentErrorIndex === 0}
              >
                <ChevronLeftIcon />
              </GroupableTabButton>
              <CountDisplay>
                {currentErrorIndex + 1}/{errors.length}
              </CountDisplay>
              <GroupableTabButton
                as="button"
                position="right"
                onClick={nextError}
                disabled={currentErrorIndex + 1 === sortedErrors.length}
              >
                <ChevronRightIcon />
              </GroupableTabButton>
              <ErrorCount>{createErrorTitleString(currentError)}</ErrorCount>
              <TitleCloseIcon
                spaceRight
                {...useFlatClick(() => {
                  setContextMenuState(false);
                })}
              >
                <XIcon aria-label="Fermer le menu contextuel d'erreur" />
              </TitleCloseIcon>
            </TitleBase>
            <DetailsMenuContent error={currentError} />
          </AnimatedDetailsMenu>
        </Modal>
        {hint}
      </ColoredPilledIconSpacer>
    </>
  );

  function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setContextMenuState((state) => !state);
  }
};
