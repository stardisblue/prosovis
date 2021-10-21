import { LocationIcon, XIcon } from '@primer/octicons-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import {
  IconSpacerPointer,
  IconSpacer,
} from '../../../components/ui/IconSpacer';
import { useFlatClick } from '../../../hooks/useClick';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { ColorablePersonIcon } from '../../../components/ColorablePersonIcon';
import {
  HighlightableProp,
  SelectableProp,
  highlightable,
  selectable,
} from './styled-components';
import { removeDetailActor } from '../../../v2/reducers/detail/actorSlice';
import {
  InformationActorGroup,
  InformationPlaceGroup,
  Interactive,
} from '../../../v2/detail/information/types';

const InteractiveEnlarge = styled(StyledFlex)<
  HighlightableProp & SelectableProp
>`
  padding-top: 1px;
  padding-bottom: 1px;
  ${highlightable}
  ${selectable}
`;

const Masked = styled.span`
  opacity: 50%;
`;
export const DisabledActorNote: React.FC<Interactive<InformationActorGroup>> =
  function ({ group, selected, highlighted }) {
    const dispatch = useDispatch();

    const handleDeleteClick = useFlatClick(() => {
      dispatch(removeDetailActor(group.id));
    });
    const color = useSelector(selectSwitchActorColor);

    return (
      <InteractiveEnlarge highlighted={highlighted} selected={selected}>
        <IconSpacerPointer as="span" {...handleDeleteClick} spaceRight>
          <XIcon className="red" aria-label="Supprimer" />
        </IconSpacerPointer>
        <IconSpacer as="span" spaceRight>
          <ColorablePersonIcon
            iconColor={color ? color(group.id) : undefined}
            aria-label="individu"
          />
        </IconSpacer>
        <Masked>
          <ActorLabel as="span" id={group} short />
        </Masked>
      </InteractiveEnlarge>
    );
  };

export const DisabledPlaceNote: React.FC<Interactive<InformationPlaceGroup>> =
  function ({ group, selected, highlighted }) {
    return (
      <InteractiveEnlarge highlighted={highlighted} selected={selected}>
        <IconSpacer as="span" spaceRight>
          <LocationIcon aria-label="lieu" />
        </IconSpacer>
        <Masked>{group.label}</Masked>
      </InteractiveEnlarge>
    );
  };
