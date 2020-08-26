import React from 'react';

/**
 *
 * @param param0
 * @deprecated
 */
const ForeignObject: React.FC<React.SVGAttributes<
  SVGForeignObjectElement
>> = function ({ children, ...props }) {
  return <foreignObject {...props}>{children}</foreignObject>;
};

export default ForeignObject;
