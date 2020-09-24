import React from 'react';
import { useSelector } from 'react-redux';
import { DeprecatedAnyEvent } from '../data/models';
import getEventIcon from '../data/getEventIcon';
import { selectSwitchKindColor } from '../selectors/switch';

export default function useEventIcon(kind: DeprecatedAnyEvent['kind']) {
  const color = useSelector(selectSwitchKindColor);
  const Icon = getEventIcon(kind);
  return <Icon iconColor={color ? color(kind) : 'black'} />;
}
