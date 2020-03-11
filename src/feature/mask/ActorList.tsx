import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { useSelector } from 'react-redux';
import Actor from './Actor';
import { selectActors } from '../../selectors/event';

const ActorList: React.FC = function() {
  const actors = useSelector(selectActors);

  return (
    <Flex className="ph2" wrap>
      {_.map(actors, actor => {
        return <Actor key={actor.id} actor={actor} />;
      })}
    </Flex>
  );
};

export default ActorList;
