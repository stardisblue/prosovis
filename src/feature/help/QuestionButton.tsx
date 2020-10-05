import React from 'react';
import { QuestionIcon } from '@primer/octicons-react';

export const QuestionButton = React.forwardRef<HTMLDivElement>(function (
  _props,
  ref
) {
  return (
    <div ref={ref}>
      <QuestionIcon size={24} />
    </div>
  );
});
