import React from 'react';
import { useSelector } from 'react-redux';
import { AnyEvent } from '../data/models';
import getEventIcon from '../feature/info/event/getEventIcon';
import { selectSwitchKindColor } from '../selectors/switch';

export default function useEventIcon(kind: AnyEvent['kind']) {
  const color = useSelector(selectSwitchKindColor);
  const Icon = getEventIcon(kind);
  return <Icon iconColor={color ? color(kind) : 'black'} />;
}
