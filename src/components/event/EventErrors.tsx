import React, { useState, useRef, useEffect } from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacer, IconSpacerPointer } from '../ui/IconSpacer';
import {
  AlertIcon,
  IconProps,
  InfoIcon,
  XCircleFillIcon,
  XCircleIcon,
  XIcon,
} from '@primer/octicons-react';
import { compact, groupBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled, { StyledComponent } from 'styled-components/macro';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';
import { usePopper } from '../ui/Popper';
import { stopEventPropagation, useFlatClick } from '../../hooks/useClick';
import { StyledFlex } from '../ui/Flex/styled-components';

const SipErrorIcon = styled(XCircleFillIcon)`
  color: ${red};
`;
const SipWarningIcon = styled(AlertFillIcon)`
  color: ${orange};
`;
const SipInfoIcon = styled(InfoFillIcon)`
  color: ${blue};
`;

function plural(value: number, singular: string, plural: string) {
  if (value === 0) return '';

  if (value === 1) return singular;
  else return `${value} ${plural}`;
}

function getIcon(
  errors: { [k in SipError['level']]?: SipError[] }
): StyledComponent<React.FC<IconProps>, any, {}, never> {
  if (errors.Error) return SipErrorIcon;

  if (errors.Warning) return SipWarningIcon;

  if (errors.Info) return SipInfoIcon;

  throw new Error('Unreachable code');
}

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

/**
 * @param errors
 * @deprecated use simple string instead
 */
export function getRichErrorLabel(
  errors: { [k in SipError['level']]?: SipError[] }
) {
  const acc: (JSX.Element | number | string)[] = [];
  if (errors.Error)
    acc.push(<IconSpacer as={XCircleIcon} spaceRight />, errors.Error.length);
  if (errors.Warning)
    acc.push(
      <IconSpacer as={AlertIcon} spaceLeft={acc.length > 0} spaceRight />,
      errors.Warning.length
    );
  if (errors.Info)
    acc.push(
      <IconSpacer as={InfoIcon} spaceLeft={acc.length > 0} spaceRight />,
      errors.Info.length
    );

  return <StyledFlex>{acc}</StyledFlex>;
}

export const EventErrors: React.FC<{ errors: SipError[] }> = function ({
  errors,
}) {
  const $ref = useRef<HTMLDivElement>(null as any);

  const groupedErrors: { [k in SipError['level']]?: SipError[] } = groupBy(
    'level',
    errors
  );
  const label = compact([
    plural(groupedErrors.Error?.length || 0, '1 erreur', 'erreurs'),
    plural(groupedErrors.Warning?.length || 0, '1 alerte', 'alertes'),
    plural(groupedErrors.Info?.length || 0, '1 note', 'notes'),
  ]).join(', ');
  const Icon = getIcon(groupedErrors);

  const [showContextMenu, setContextMenuState] = useState(false);

  const [hint, showHint, hideHint] = usePopper($ref, label);
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

  return (
    <>
      <IconSpacerPointer
        spaceLeft
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
      </IconSpacerPointer>
      {hint}
    </>
  );

  function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    console.log('hello click');
    setContextMenuState((state) => !state);
  }
};
