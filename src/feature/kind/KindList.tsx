import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { connect } from 'react-redux';
import { AnyEvent } from '../../data';
import { selectKindMask } from '../../selectors/mask';
import Kind from './Kind';
import { RootState } from '../../reducers';

type KindMask = {
  [k in AnyEvent['kind']]: boolean;
};

const KindList: React.FC<{ kinds?: KindMask }> = function({ kinds }) {
  return (
    <Flex className="ph2" justify="between" wrap>
      {_.map(kinds, (state, id: AnyEvent['kind']) => (
        <Kind key={id} id={id} state={state} />
      ))}
    </Flex>
  );
};

export default connect((state: RootState) => ({
  kinds: selectKindMask(state)
}))(KindList);
