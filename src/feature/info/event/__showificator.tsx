import React from 'react';
import { Nullable, Ressource, NamedPlace } from '../../../data/models';
import styled from 'styled-components/macro';

/**
 * @deprecated
 */
const StyledSpan = styled.span<{ showQuestion: boolean }>(({ showQuestion }) =>
  showQuestion
    ? `
    position: relative;
  
    &::after {
      content: '?';
      font-size: 12px;
      right: -5px;
      top: -2px;
      text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
        1px 1px 0 white;
      position: absolute;
      width: 6px;
    }
  `
    : ''
);

/**
 *
 * @param event
 * @deprecated
 */
const showificator = function <P extends string, E extends { [k in P]: E[P] }>(
  event: E
) {
  return function y(strings: TemplateStringsArray, label: keyof E) {
    if (event[label] && isNamedPlace(event[label])) {
      return (event[label] as Nullable<Ressource>)?.label ? (
        <>
          {strings[0]}
          <StyledSpan showQuestion={!hasCoordinates(event[label])}>
            {(event[label] as Nullable<Ressource>)?.label}
          </StyledSpan>
          {strings[1]}
        </>
      ) : (
        ''
      );
    }

    return (event[label] as Nullable<Ressource>)?.label
      ? strings[0] + (event[label] as Nullable<Ressource>)?.label + strings[1]
      : '';
  };
};

/**
 *
 * @param obj
 * @deprecated
 */
function isNamedPlace(obj: any): obj is NamedPlace {
  return obj.kind === 'NamedPlace';
}

/**
 *
 * @param obj
 * @deprecated
 */
function hasCoordinates(obj: any) {
  return obj.lng != null && obj.lat != null;
}

export default showificator;
