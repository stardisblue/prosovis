import React from 'react';
import styled from 'styled-components/macro';
import { TriangleRightIcon } from '@primer/octicons-react';
import { Datation } from '../data/models';
import { Popper } from './ui/Popper';

const StyledTime = styled.time`
  white-space: nowrap;
  font-size: 12px;
`;

export const DateLabel: React.FC<{
  datation: Datation;
  showTooltip?: boolean;
}> = function ({ datation: d, showTooltip = true }) {
  if (showTooltip) {
    return (
      <Popper content={`${d.label} - ${d.clean_date}`} children={children} />
    );
  }

  return (
    <StyledTime
      aria-label={`${d.label} - ${d.clean_date}`}
      dateTime={d.clean_date}
      data-uri={d.uri}
    >
      {d.value}
    </StyledTime>
  );

  function children(
    $ref: React.MutableRefObject<HTMLSpanElement>,
    show: () => void,
    hide: () => void
  ) {
    return (
      <StyledTime
        aria-label={`${d.label} - ${d.clean_date}`}
        dateTime={d.clean_date}
        data-uri={d.uri}
        ref={$ref}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        {d.value}
      </StyledTime>
    );
  }
};

const EventDateBase = styled.div`
  text-align: right;
`;

export const EventDates: React.FC<{
  dates: Datation[];
  showTooltip?: boolean;
}> = function ({ dates, showTooltip }) {
  if (dates.length === 1) {
    return (
      <EventDateBase>
        <DateLabel datation={dates[0]} showTooltip={showTooltip} />
      </EventDateBase>
    );
  }

  if (dates.length > 2) {
    console.error('there is more than two dates', dates);
  }
  return (
    <EventDateBase>
      <DateLabel datation={dates[0]} showTooltip={showTooltip} />
      <TriangleRightIcon />
      <DateLabel datation={dates[1]} showTooltip={showTooltip} />
    </EventDateBase>
  );
};
