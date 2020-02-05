import React, { memo } from 'react';
import classnames from 'classnames';
import { FlexItemProps, flexItemClasses } from './FlexItem';

type FlexProps = {
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  column?: boolean;
  onClick?: React.MouseEventHandler;
};

export const Flex: React.FC<React.PropsWithChildren<
  FlexProps & FlexItemProps
>> = function(
  {
    tag = 'div',
    className,
    children,
    column,
    items,
    justify,
    onClick,
    wrap,
    ...rest
  } // props
) {
  const TagWrapper = tag;
  return (
    <TagWrapper
      className={classnames(
        'flex',
        className,
        {
          [`justify-${justify}`]: justify,
          'flex-wrap': wrap === true,
          'flex-nowrap': wrap === false,
          [`items-${items}`]: items,
          'flex-column': column
        },
        flexItemClasses(rest)
      )}
      onClick={onClick}
    >
      {children}
    </TagWrapper>
  );
};

export const FlexMemo = memo(Flex);

export default FlexMemo;
