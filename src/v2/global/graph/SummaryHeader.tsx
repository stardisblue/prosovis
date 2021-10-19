import { PlusIcon, XIcon } from '@primer/octicons-react';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ActorLabel from '../../../components/ActorLabel';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { useFlatClick } from '../../../hooks/useClick';
import { lightgray } from '../../components/theme';
import { removeDetailActor } from '../../reducers/detail/actorSlice';
import { resetActorSummary } from '../../reducers/global/actorSummarySlice';
import { selectDetailActors } from '../../selectors/detail/actors';
import { tryAddDetailActorThunk } from '../../thunks/actors';

export const SummaryHeader: React.FC<{ actor: string }> = function ({ actor }) {
  const dispatch = useDispatch();
  const actors = useSelector(selectDetailActors);
  const actorExists = actors[actor] !== undefined;

  const [handleClick, Icon] = useMemo(
    () =>
      actorExists
        ? [
            () => {
              dispatch(removeDetailActor(actor));
              dispatch(resetActorSummary());
            },
            <XIcon
              className="ma1 flex-shrink-0 red"
              verticalAlign="text-bottom"
              aria-label={'supprimer'}
            />,
          ]
        : [
            () => {
              dispatch(tryAddDetailActorThunk(actor));
              dispatch(resetActorSummary());
            },
            <PlusIcon
              className="ma1 flex-shrink-0 green"
              verticalAlign="text-bottom"
              aria-label={'ajouter'}
            />,
          ],
    [dispatch, actorExists, actor]
  );

  return (
    <ActorTitle>
      <IconSpacerPointer spaceRight {...useFlatClick(handleClick)}>
        {Icon}
      </IconSpacerPointer>
      <ActorLabel id={actor} />
    </ActorTitle>
  );
};
const ActorTitle = styled(StyledFlex)`
  border-bottom: 1px solid ${lightgray};
`;
