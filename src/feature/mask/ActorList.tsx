import React from 'react';
import { useSelector } from 'react-redux';
import Actor from './Actor';
import { selectDetailActors } from '../../v2/selectors/detail/actors';
import styled from 'styled-components/macro';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { map } from 'lodash/fp';

const WrapFlex = styled(StyledFlex)`
  flex-wrap: wrap;
`;

const ActorList: React.FC = function () {
  const actors = useSelector(selectDetailActors);

  return (
    <WrapFlex>
      {map(
        (actor) => (
          <Actor key={actor.id} actor={actor} />
        ),
        actors
      )}
    </WrapFlex>
  );
};

export default ActorList;
