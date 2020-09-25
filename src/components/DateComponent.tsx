import React from 'react';
import styled from 'styled-components/macro';
import { TriangleRightIcon } from '@primer/octicons-react';
import { Datation } from '../data/models';
import { CenteredTopPopper } from './ui/Popper';

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
      <CenteredTopPopper
        content={`${d.label} - ${d.clean_date}`}
        children={children}
      />
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
  /*flex: 0;
  max-width: 6rem;  is this a sensible default (96px) */
  /* font-size: 12px; */
`;

export const EventDates: React.FC<{
  dates: Datation[];
  showTooltip?: boolean;
}> = function ({ dates, showTooltip }) {
  if (dates.length === 1) {
    return <DateLabel datation={dates[0]} showTooltip={showTooltip} />;
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
