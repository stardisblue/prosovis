import React, { forwardRef, memo } from 'react';
import classnames from 'classnames';

type FlexProps = React.PropsWithChildren<{
  className?: string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  onClick?: React.MouseEventHandler;
}>;

const FlexBase: React.FC<FlexProps> = function(
  { className, children, justify, onClick } //, ref
) {
  return (
    <div
      // ref={ref}
      className={classnames('flex', className, {
        [`justify-${justify}`]: justify
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const Flex = memo(
  // forwardRef<HTMLDivElement, FlexProps>(
  FlexBase
  // )
);
