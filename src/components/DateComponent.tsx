import React from 'react';
import styled from 'styled-components/macro';
import { Datation } from '../data/models';
import { CenteredTopPopper } from './Popper';
import { StyledFlex } from './ui/Flex/styled-components';

const LabelBase = styled.span``;

export const DateLabel: React.FC<{ datation: Datation }> = function ({
  datation: d,
}) {
  function children(
    $ref: React.MutableRefObject<HTMLSpanElement>,
    show: () => void,
    hide: () => void
  ) {
    return (
      <LabelBase
        ref={$ref}
        title={`${d.label} - ${d.clean_date}`}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        <time dateTime={d.clean_date} data-uri={d.uri}>
          {d.value}
        </time>
      </LabelBase>
    );
  }
  return (
    <CenteredTopPopper
      content={`${d.label} - ${d.clean_date}`}
      children={children}
    />
  );
};

const FlexWrap = styled(StyledFlex)`
  flex-wrap: wrap;
  max-width: 6em; /* is this a sensible default (96px) */

  & > *:not(:last-child) {
    margin-right: 0.25em;
  }
`;

export const EventDates: React.FC<{ dates: Datation[] }> = function ({
  dates,
}) {
  if (dates.length === 1) {
    return <DateLabel datation={dates[0]} />;
  }
  return (
    <FlexWrap>
      {dates.map((d) => (
        <DateLabel key={d.id} datation={d} />
      ))}
    </FlexWrap>
  );
};
