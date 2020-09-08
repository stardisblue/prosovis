import React, { useCallback } from 'react';

import { PersonIcon, XIcon } from '@primer/octicons-react';
import { useSelector, useDispatch } from 'react-redux';
import { PrimaryKey } from '../../../data/typings';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { deleteActor } from '../../../reducers/eventSlice';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';

const StyledPersonIcon = styled(PersonIcon)<{
  iconColor?: string;
}>(({ iconColor }) => (iconColor ? `color: ${iconColor};` : ''));

/**
 *
 * @param param0
 * @deprecated
 */
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
