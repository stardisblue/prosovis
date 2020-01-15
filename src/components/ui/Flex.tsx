import React, { memo } from 'react';
import classnames from 'classnames';

type FlexProps = React.PropsWithChildren<{
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  onClick?: React.MouseEventHandler;
}>;

const FlexBase: React.FC<FlexProps> = function(
  { tag = 'div', className, children, items, justify, onClick, wrap } //, ref
) {
  const TagWrapper = tag;
  return (
    <TagWrapper
      // ref={ref}
      className={classnames('flex', className, {
        [`justify-${justify}`]: justify,
        'flex-wrap': wrap === true,
        'flex-nowrap': wrap === false,
        [`items-${items}`]: items
      })}
      onClick={onClick}
    >
      {children}
    </TagWrapper>
  );
};

export const Flex = memo(
  // forwardRef<HTMLDivElement, FlexProps>(
  FlexBase
  // )
);
