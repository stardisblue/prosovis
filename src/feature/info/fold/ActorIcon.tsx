import React, { useCallback } from 'react';

import { PersonIcon, XIcon } from '@primer/octicons-react';
import { useSelector, useDispatch } from 'react-redux';
import { PrimaryKey } from '../../../data/typings';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { deleteActor } from '../../../reducers/eventSlice';
import styled from 'styled-components/macro';

const StyledPersonIcon = styled(PersonIcon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));

const ActorIcon: React.FC<{
  id: PrimaryKey;
}> = function ({ id }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(deleteActor(id));
  }, [dispatch, id]);

  const color = useSelector(selectSwitchActorColor);
  return (
    <>
      <span className="pointer" onClick={handleClick}>
        <XIcon
          className="ma1 flex-shrink-0 red"
          verticalAlign="text-bottom"
          aria-label="Supprimer"
        />
      </span>
      <StyledPersonIcon
        iconColor={color ? color(id) : undefined}
        className="ma1 flex-shrink-0"
      />
    </>
  );
};

export default ActorIcon;
