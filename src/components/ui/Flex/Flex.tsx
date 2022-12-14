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
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

/**
 * @deprecated
 * @param param0
 */
export const Flex: React.FC<
  React.PropsWithChildren<FlexProps & FlexItemProps>
> = function (
  {
    tag = 'div',
    className,
    children,
    column,
    items,
    justify,
    onClick,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
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
          'flex-column': column,
        },
        flexItemClasses(rest)
      )}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </TagWrapper>
  );
};

/**
 * @deprecated
 */
export const FlexMemo = memo(Flex);

/** @deprecated */
export default FlexMemo;
