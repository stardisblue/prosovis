import React from 'react';
import StyledOcticon from '../StyledOcticon';
import { Person } from '@primer/octicons-react';
import { useSelector } from 'react-redux';
import { PrimaryKey } from '../../../data';
import { selectSwitchActorColor } from '../../../selectors/switch';

const ActorIcon: React.FC<{
  id: PrimaryKey;
}> = function({ id }) {
  const color = useSelector(selectSwitchActorColor);
  return (
    <StyledOcticon
      iconColor={color ? color(id) : undefined}
      className="ma1 flex-shrink-0"
      icon={Person}
    />
  );
};

export default ActorIcon;
