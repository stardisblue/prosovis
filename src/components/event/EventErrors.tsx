import React from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacerPointer } from '../ui/IconSpacer';
import { XCircleFillIcon } from '@primer/octicons-react';
import { groupBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled from 'styled-components/macro';
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

function getIcon(errors: { [k in SipError['level']]?: SipError[] }) {
  const [Icon, label] = errors.Error
    ? [SipErrorIcon, 'Error']
    : errors.Warning
    ? [SipWarningIcon, 'Warning']
    : errors.Info
    ? [SipInfoIcon, 'Info']
    : [];

  if (Icon) return <CenteredTopPopper content={label} children={children} />;

  return null;

  function children(
    $ref: React.MutableRefObject<HTMLElement>,
    show: () => void,
    hide: () => void
  ) {
    if (!Icon) throw new Error('Unreachable Code reached');
    return (
      <i
        ref={$ref}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        <Icon aria-label={label} />
      </i>
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

  return <IconSpacerPointer spaceLeft>{icon}</IconSpacerPointer>;
};
