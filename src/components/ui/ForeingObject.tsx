import React from 'react';

const ForeignObject: React.FC<React.SVGAttributes<
  SVGForeignObjectElement
>> = function ({ children, ...props }) {
  return <foreignObject {...props}>{children}</foreignObject>;
};

export default ForeignObject;
