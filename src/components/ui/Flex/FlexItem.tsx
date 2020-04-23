import React, { memo } from 'react';
import classnames from 'classnames';
import './style.css';

export type FlexItemProps = {
  auto?: boolean;
  className?: string;
  col?: boolean;
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'last';
  self?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  tag?: keyof JSX.IntrinsicElements;
};

export const FlexItem: React.FC<React.PropsWithChildren<
  FlexItemProps
>> = function (
  { children, className, tag = 'div', ...flexItemProps } // items
) {
  const TagWrapper = tag;

  return (
    <TagWrapper
      className={classnames(className, flexItemClasses(flexItemProps))}
    >
      {children}
    </TagWrapper>
  );
};

export const FlexItemMemo = memo(FlexItem);

export default FlexItemMemo;

export function flexItemClasses({ self, order, auto, col }: FlexItemProps) {
  return {
    [`self-${self}`]: self,
    [`order-${order}`]: order,
    'flex-auto': auto,
    'flex-col': col,
  };
}
