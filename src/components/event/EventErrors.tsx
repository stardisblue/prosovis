import React from 'react';
import { SipError } from '../../data/sip-models';
import { IconSpacerPointer } from '../ui/IconSpacer';
import { XCircleFillIcon } from '@primer/octicons-react';
import { groupBy } from 'lodash/fp';
import { blue, red, orange } from '../ui/colors';
import styled from 'styled-components/macro';
import AlertFillIcon from '../ui/icon/AlertFillIcon';
import InfoFillIcon from '../ui/icon/InfoFillIcon';

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
  if (errors.Error) return <SipErrorIcon />;
  if (errors.Warning) return <SipWarningIcon />;
  if (errors.Info) return <SipInfoIcon />;
  else return null;
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
