import React from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { useSelector } from 'react-redux';
import Kind from './Kind';
import { selectKinds } from '../../selectors/event';
import { SiprojurisEvent } from '../../data/sip-models';

const KindList: React.FC = function () {
  const kinds = useSelector(selectKinds);

  return (
    <Flex className="ph2" wrap>
      {_.map(kinds, (kind: SiprojurisEvent['kind']) => (
        <Kind key={kind} id={kind} />
      ))}
    </Flex>
  );
};

export default KindList;
