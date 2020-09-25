import React from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacerPointer } from '../ui/IconSpacer';
import { IconProps, XCircleFillIcon } from '@primer/octicons-react';
import { groupBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled, { StyledComponent } from 'styled-components/macro';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';
import { CenteredTopPopper } from '../ui/Popper';

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
  if (value === 1) {
    return singular;
  } else {
    return `${value} ${plural}`;
  }
}

function getIcon(errors: { [k in SipError['level']]?: SipError[] }) {
  const value:
    | [StyledComponent<React.FC<IconProps>, any, {}, never>, string]
    | null = errors.Error
    ? [SipErrorIcon, plural(errors.Error.length, 'Une erreur', 'erreurs')]
    : errors.Warning
    ? [SipWarningIcon, plural(errors.Warning.length, 'Un warning', 'warnings')]
    : errors.Info
    ? [SipInfoIcon, plural(errors.Info.length, 'Une note', 'notes')]
    : null;

  return value;
}

function wrapPopper([Icon, label]: [
  StyledComponent<React.FC<IconProps>, any, {}, never>,
  string
]) {
  return <CenteredTopPopper content={label} children={children} />;

  function children(
    $ref: React.MutableRefObject<HTMLDivElement>,
    show: () => void,
    hide: () => void
  ) {
    if (!Icon) throw new Error('Unreachable Code reached');
    return (
      <IconSpacerPointer
        spaceLeft
        ref={$ref}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        <Icon aria-label={label} />
      </IconSpacerPointer>
    );
  }
}

export const EventErrors: React.FC<{ errors?: SipError[] }> = function ({
  errors,
}) {
  if (!errors) {
    return null;
  }

  const errorGroups = groupBy('level', errors);
  console.log(errorGroups);
  const icon = getIcon(errorGroups);
  const wrapper = icon ? wrapPopper(icon) : null;

  return wrapper;
};
