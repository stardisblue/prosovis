import React from 'react';
import StyledOcticon from '../StyledOcticon';
import { Flex, FlexItem } from '../../../components/ui/Flex';
import { Icon } from '@primer/octicons-react';
import classnames from 'classnames';
import { EventDates } from '../EventDates';

const InfoEvent: React.FC<{
  handleSelect: any;
  select: any;
  mask: any;
  highlight: any;
  hideOrColorIcon?: string;
  icon: Icon;
  dates: any;
}> = function({
  hideOrColorIcon,
  dates,
  icon,
  highlight,
  mask,
  select,
  handleSelect,
  children
}) {
  return (
    <Flex
      justify="between"
      items="center"
      className={classnames('pb1', 'br2', {
        b: select,
        'o-50': mask,
        'bg-light-gray': highlight
      })}
      onClick={handleSelect}
    >
      <span className="ph2">
        {hideOrColorIcon && (
          <StyledOcticon
            iconColor={hideOrColorIcon}
            icon={icon}
            width={16}
            height={16}
          />
        )}
      </span>
      <FlexItem auto>{children}</FlexItem>
      <EventDates dates={dates} />
    </Flex>
  );
};

export default InfoEvent;
