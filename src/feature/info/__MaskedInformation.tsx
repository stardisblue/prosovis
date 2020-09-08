import React from 'react';
import classnames from 'classnames';
import { Flex } from '../../components/ui/Flex';
import { LocationIcon } from '@primer/octicons-react';
import ActorIcon from './fold/ActorIcon';
import { Ressource } from '../../data/typings';
/**
 *
 * @param param0
 * @deprecated
 */
const DeprecatedMaskedInformation: React.FC<{
  group: Ressource;
  kind: 'Actor' | 'NamedPlace';
  selected: boolean;
  highlighted: boolean;
}> = function ({ group, kind, selected, highlighted }) {
  return (
    <Flex
      col
      justify="between"
      className={classnames('b--moon-gray ph1 pt1 flex-grow-0', {
        'bg-light-gray': highlighted,
      })}
      items="baseline"
    >
      {kind === 'Actor' ? (
        <ActorIcon id={group.id} />
      ) : (
        <LocationIcon className="ma1 flex-shrink-0" />
      )}
      <div
        className={classnames('flex-auto o-50', {
          b: selected,
        })}
      >
        {group.label}
      </div>
    </Flex>
  );
};

export default DeprecatedMaskedInformation;
