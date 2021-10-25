import { IconProps, XCircleFillIcon } from '@primer/octicons-react';
import { compact, groupBy } from 'lodash/fp';
import React, { useMemo, useRef, useState } from 'react';
import styled, { StyledComponent } from 'styled-components/macro';
import { stopEventPropagation } from '../../hooks/useClick';
import { blue, lightgray, orange, red } from '../../v2/components/theme';
import { ProsoVisError } from '../../v2/types/errors';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';
import { IconSpacerPointer } from '../ui/IconSpacer';
import { usePopper, useRefPopper } from '../ui/Popper';
import { EventErrorContextMenu } from './EventErrorContextMenu';

const SipErrorIcon = styled(XCircleFillIcon)`
  color: ${red};
`;
const SipWarningIcon = styled(AlertFillIcon)`
  color: ${orange};
`;
const SipInfoIcon = styled(InfoFillIcon)`
  color: ${blue};
`;

const SipGrayedErrorIcon = styled(XCircleFillIcon)`
  color: ${lightgray};
`;
const SipGrayedWarningIcon = styled(AlertFillIcon)`
  color: ${lightgray};
`;
const SipGrayedInfoIcon = styled(InfoFillIcon)`
  color: ${lightgray};
`;

function plural(value: number, singular: string, plural: string) {
  if (value === 0) return '';

  if (value === 1) return singular;
  else return `${value} ${plural}`;
}

function getErrorLabel(errors: {
  [k in ProsoVisError['level']]?: ProsoVisError[];
}) {
  return compact([
    plural(errors.Error?.length || 0, '1 erreur', 'erreurs'),
    plural(errors.Warning?.length || 0, '1 alerte', 'alertes'),
    plural(errors.Info?.length || 0, '1 note', 'notes'),
  ]).join(', ');
}

type ColoredErrorInfoType = [
  StyledComponent<React.FC<IconProps>, any, {}, never>,
  string,
  string
];

type GrayedErrorInfoType = [
  StyledComponent<React.FC<IconProps>, any, {}, never>,
  string
];

function getErrorInfo(
  errors: ProsoVisError[],
  gray?: true
): ColoredErrorInfoType;
function getErrorInfo(
  errors: ProsoVisError[],
  gray: false
): GrayedErrorInfoType;
function getErrorInfo(
  errors: ProsoVisError[],
  gray: boolean = true
): ColoredErrorInfoType | GrayedErrorInfoType {
  const groupedErrors: { [k in ProsoVisError['level']]?: ProsoVisError[] } =
    groupBy('level', errors);
  const label = getErrorLabel(groupedErrors);

  if (!gray) {
    if (groupedErrors.Error) return [SipGrayedErrorIcon, label];
    if (groupedErrors.Warning) return [SipGrayedWarningIcon, label];
    if (groupedErrors.Info) return [SipGrayedInfoIcon, label];
  } else {
    if (groupedErrors.Error) return [SipErrorIcon, red, label];
    if (groupedErrors.Warning) return [SipWarningIcon, orange, label];
    if (groupedErrors.Info) return [SipInfoIcon, blue, label];
  }

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

export const SimpleEventErrors: React.FC<{ errors: ProsoVisError[] }> =
  function ({ errors }) {
    const [Icon, label] = getErrorInfo(errors, false);

    const [hint, $ref, showHint, hideHint] =
      useRefPopper<HTMLDivElement>(label);

    return (
      <>
        <ColoredPilledIconSpacer
          spaceLeft
          ref={$ref}
          onMouseEnter={showHint}
          onFocus={showHint}
          onMouseLeave={hideHint}
          onBlur={hideHint}
          color={lightgray}
          data-count={errors.length}
        >
          <Icon aria-label={label} />
        </ColoredPilledIconSpacer>
        {hint}
      </>
    );
  };

export const EventErrors: React.FC<{
  errors: ProsoVisError[];
  highlight: boolean;
}> = function ({ errors, highlight }) {
  const $ref = useRef<HTMLDivElement>(null as any);

  const [showContextMenu, setContextMenuState] = useState(false);

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
        onMouseLeave={hideHint}
        onBlur={hideHint}
        onContextMenu={handleContextMenu}
        onMouseUp={stopEventPropagation}
      >
        <Icon aria-label={label} />
        {showContextMenu && (
          <EventErrorContextMenu
            highlight={highlight}
            $parentRef={$ref}
            close={closeContextMenu}
            errors={errors}
          />
        )}
        {hint}
      </ColoredPilledIconSpacer>
    </>
  );
  function closeContextMenu() {
    setContextMenuState(false);
    hideHint();
  }

  function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setContextMenuState((state) => !state);
  }
};
