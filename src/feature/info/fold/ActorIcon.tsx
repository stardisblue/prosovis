import React, { useCallback } from 'react';
import StyledOcticon from '../StyledOcticon';
import Octicon, { Person, X } from '@primer/octicons-react';
import { useSelector, useDispatch } from 'react-redux';
import { PrimaryKey } from '../../../data';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { deleteActor } from '../../../reducers/eventSlice';

const ActorIcon: React.FC<{
  id: PrimaryKey;
}> = function({ id }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(deleteActor(id));
  }, [dispatch, id]);

  const color = useSelector(selectSwitchActorColor);
  return (
    <>
      <span className="pointer" onClick={handleClick}>
        <Octicon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          icon={X}
          ariaLabel={'Supprimer'}
        />
      </span>
      <StyledOcticon
        iconColor={color ? color(id) : undefined}
        className="ma1 flex-shrink-0"
        icon={Person}
      />
    </>
  );
};

export default ActorIcon;
