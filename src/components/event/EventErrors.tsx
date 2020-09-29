import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacerPointer } from '../ui/IconSpacer';
import { IconProps, XCircleFillIcon, XIcon } from '@primer/octicons-react';
import { compact, groupBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled, { StyledComponent } from 'styled-components/macro';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';
import { usePopper, useRefPopper } from '../ui/Popper';
import { stopEventPropagation, useFlatClick } from '../../hooks/useClick';

const SipErrorIcon = styled(XCircleFillIcon)`
  color: ${red};
`;
const SipWarningIcon = styled(AlertFillIcon)`
  color: ${orange};
`;
const SipInfoIcon = styled(InfoFillIcon)`
  color: ${blue};
`;

const StyledDiv = styled.div`
  z-index: 9998;
  position: absolute;
`;

const DetailsMenu = styled.div`
  width: 20em;
  min-height: 200px;
  background-color: white;
  box-shadow: 1px 1px 5px 0 black;
  border-radius: 3px;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

function plural(value: number, singular: string, plural: string) {
  if (value === 0) return '';

  if (value === 1) return singular;
  else return `${value} ${plural}`;
}

function getErrorLabel(errors: { [k in SipError['level']]?: SipError[] }) {
  return compact([
    plural(errors.Error?.length || 0, '1 erreur', 'erreurs'),
    plural(errors.Warning?.length || 0, '1 alerte', 'alertes'),
    plural(errors.Info?.length || 0, '1 note', 'notes'),
  ]).join(', ');
}

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

export const EventErrors: React.FC<{ errors: SipError[] }> = function ({
  errors,
}) {
  const $ref = useRef<HTMLDivElement>(null as any);

  const [showContextMenu, setContextMenuState] = useState(false);

  const [details, showDetails, hideDetails] = usePopper(
    $ref,
    <DetailsMenu
      onClick={stopEventPropagation}
      onMouseUp={stopEventPropagation}
      onContextMenu={stopEventPropagation}
      style={{ position: 'relative', top: 0, right: 0 }}
    >
      <CloseButton
        {...useFlatClick(() => {
          setContextMenuState(false);
        })}
      >
        <XIcon aria-label="Fermer le menu contextuel d'erreur" />
      </CloseButton>
    </DetailsMenu>,
    'north-west',
    StyledDiv
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
          setContextMenuState(false);
        }}
        onBlur={hideHint}
        onContextMenu={handleContextMenu}
        onClick={handleContextMenu}
        onMouseUp={stopEventPropagation}
      >
        <Icon aria-label={label} />
        {details}
      </ColoredPilledIconSpacer>
      {hint}
    </>
  );

  function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setContextMenuState((state) => !state);
  }
};
