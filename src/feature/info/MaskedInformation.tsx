import React, { useCallback } from 'react';
import classnames from 'classnames';
import { Flex } from '../../components/ui/Flex/';
import Octicon, { X, Location } from '@primer/octicons-react';
import ActorIcon from './fold/ActorIcon';
import StyledOcticon from './StyledOcticon';
import { Ressource } from '../../data';
import { useDispatch } from 'react-redux';
import { deleteActor } from '../../reducers/eventSlice';

const MaskedInformation: React.FC<{
  group: Ressource;
  kind: 'Actor' | 'NamedPlace';
  masked: boolean;
  selected: boolean;
  highlighted: boolean;
}> = function({ group, kind, masked, selected, highlighted }) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(deleteActor(group.id));
  }, [dispatch, group.id]);

  return (
    <Flex
      col
      justify="between"
      className={classnames('b--moon-gray ph1 pt1 flex-grow-0', {
        'bg-light-gray': highlighted
      })}
      items="baseline"
    >
      {kind === 'Actor' ? (
        <ActorIcon id={group.id} />
      ) : (
        <StyledOcticon className="ma1 flex-shrink-0" icon={Location} />
      )}
      <div
        className={classnames('flex-auto o-50', {
          b: selected
        })}
      >
        {group.label}
      </div>
      {kind === 'Actor' && (
        <span onClick={handleClick}>
          <Octicon
            className="ma1 flex-shrink-0 red"
            verticalAlign="text-bottom"
            icon={X}
            ariaLabel={'Supprimer'}
          />
        </span>
      )}
    </Flex>
  );
};

export default MaskedInformation;
