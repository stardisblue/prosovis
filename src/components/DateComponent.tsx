import React from 'react';
import styled from 'styled-components/macro';
// import { TriangleRightIcon } from '@primer/octicons-react';
import { Popper } from './ui/Popper';
import { ProsoVisDate, ProsoVisEvent } from '../v2/types/events';

const StyledTime = styled.time`
  white-space: nowrap;
  font-size: 12px;
`;

export const DateLabel: React.FC<{
  datation: ProsoVisDate;
  showTooltip?: boolean;
  className?: string;
}> = function ({ datation: d, showTooltip = true, className }) {
  if (showTooltip) {
    return <Popper content={`${d.kind} - ${d.value}`} children={children} />;
  }

  return (
    <StyledTime
      aria-label={`${d.kind} - ${d.value}`}
      dateTime={d.value}
      data-uri={d.uri}
      className={className}
    >
      {d.label}
    </StyledTime>
  );

  function children(
    $ref: React.MutableRefObject<HTMLSpanElement>,
    show: () => void,
    hide: () => void
  ) {
    return (
      <StyledTime
        aria-label={`${d.kind} - ${d.value}`}
        dateTime={d.value}
        data-uri={d.uri}
        ref={$ref}
        className={className}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        {d.label}
      </StyledTime>
    );
  }
};

const EventDateBase = styled.div`
  text-align: right;
`;

const WrapEventDate = styled(EventDateBase)`
  display: flex;
  flex-wrap: wrap;
  max-width: 7em;
  justify-content: flex-end;
`;

const SpacedDateLabel = styled(DateLabel)`
  margin-left: 0.5em;
`;

export const EventDates: React.FC<{
  dates: ProsoVisEvent['datation'];
  showTooltip?: boolean;
}> = function ({ dates, showTooltip }) {
  if (dates.length === 0) return null;

  if (dates.length === 1) {
    return (
      <EventDateBase>
        <DateLabel datation={dates[0]} showTooltip={showTooltip} />
      </EventDateBase>
    );
  }
  dates = dates as [ProsoVisDate, ProsoVisDate, ...ProsoVisDate[]];

  if (dates.length > 2) {
    console.error('there is more than two dates', dates);
  }

  return (
    <WrapEventDate>
      <DateLabel datation={dates[0]} showTooltip={showTooltip} />

      {/* <TriangleRightIcon /> */}
      <SpacedDateLabel datation={dates[1]} showTooltip={showTooltip} />
    </WrapEventDate>
  );
};
