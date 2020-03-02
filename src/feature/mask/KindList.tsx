import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { useSelector } from 'react-redux';
import { AnyEvent } from '../../data';
import Kind from './Kind';
import { selectKinds } from '../../selectors/event';

const KindList: React.FC = function() {
  const kinds = useSelector(selectKinds);

  return (
    <Flex className="ph2" justify="between" wrap>
      {_.map(kinds, (kind: AnyEvent['kind']) => (
        <Kind key={kind} id={kind} />
      ))}
    </Flex>
  );
};

export default KindList;
