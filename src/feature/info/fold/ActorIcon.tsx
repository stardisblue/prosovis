import React, { useCallback } from 'react';

import { PersonIcon, XIcon } from '@primer/octicons-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSwitchActorColor } from '../../../selectors/switch';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { removeDetailActor } from '../../../v2/reducers/detail/actorSlice';

const StyledPersonIcon = styled(PersonIcon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));

/**
 *
 * @param param0
 * @deprecated
 */
const ActorIcon: React.FC<{
  id: string;
}> = function ({ id }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(removeDetailActor(id));
  }, [dispatch, id]);

  const color = useSelector(selectSwitchActorColor);

  return (
    <>
      <IconSpacerPointer as="span" onClick={handleClick}>
        <XIcon
          className="red"
          verticalAlign="text-bottom"
          aria-label="Supprimer"
        />
      </IconSpacerPointer>
      <IconSpacerPointer as="span">
        <StyledPersonIcon iconColor={color ? color(id) : undefined} />
      </IconSpacerPointer>
    </>
  );
};

export default ActorIcon;
