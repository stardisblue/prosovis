import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import Actor from './Actor';
import { selectDetailActors } from '../../v2/selectors/detail/actors';
import styled from 'styled-components/macro';
import { StyledFlex } from '../../components/ui/Flex/styled-components';

const WrapFlex = styled(StyledFlex)`
  flex-wrap: wrap;
`;

const ActorList: React.FC = function () {
  const actors = useSelector(selectDetailActors);

  return (
    <WrapFlex>
      {_.map(actors, (actor) => {
        return <Actor key={actor.id} actor={actor} />;
      })}
    </WrapFlex>
  );
};

export default ActorList;
