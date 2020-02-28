import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { connect } from 'react-redux';
import { AnyEvent } from '../../data';
import { selectKindMask, kindMaskState } from '../../selectors/mask';
import Kind from './Kind';
import { RootState } from '../../reducers';
import { selectKinds } from '../../selectors/event';
import { KindMask } from '../../reducers/maskSlice';

const KindList: React.FC<{
  kinds: AnyEvent['kind'][];
  masks?: KindMask;
}> = function({ kinds, masks }) {
  return (
    <Flex className="ph2" justify="between" wrap>
      {_.map(kinds, (kind: AnyEvent['kind']) => {
        return <Kind key={kind} id={kind} state={kindMaskState(kind, masks)} />;
      })}
    </Flex>
  );
};

export default connect((state: RootState) => ({
  masks: selectKindMask(state),
  kinds: selectKinds(state)
}))(KindList);
