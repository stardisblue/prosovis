import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { connect } from 'react-redux';
import { selectActorMask, actorMaskState } from '../../selectors/mask';
import { RootState } from '../../reducers';
import Actor from './Actor';
import { ActorMask } from '../../reducers/maskSlice';
import { selectActors } from '../../selectors/event';
import { AnyEvent } from '../../data';

const ActorList: React.FC<{
  actors: AnyEvent['actor'][];
  masks?: ActorMask;
}> = function({ actors, masks }) {
  return (
    <Flex className="ph2" justify="between" wrap>
      {_.map(actors, actor => {
        return (
          <Actor
            key={actor.id}
            actor={actor}
            state={actorMaskState(actor, masks)}
          />
        );
      })}
    </Flex>
  );
};

export default connect((state: RootState) => ({
  masks: selectActorMask(state),
  actors: selectActors(state)
}))(ActorList);
