import React from 'react';
import styled from 'styled-components/macro';
import { ProsoVisDate, ProsoVisEvent } from '../types/events';
import { Popper } from '../../components/ui/Popper';
import { isNil } from 'lodash/fp';

const StyledTime = styled.time`
  white-space: nowrap;
  font-size: 12px;
`;

export const ProsoVisDateLabel: React.FC<{
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

const SpacedDateLabel = styled(ProsoVisDateLabel)`
  margin-left: 0.5em;
`;

export const ProsoVisDates: React.FC<{
  dates: ProsoVisEvent['datation'];
  showTooltip?: boolean;
}> = function ({ dates, showTooltip }) {
  if (isNil(dates) || dates.length === 0) return null;

  if (dates.length === 1) {
    return (
      <EventDateBase>
        <ProsoVisDateLabel datation={dates[0]} showTooltip={showTooltip} />
      </EventDateBase>
    );
  }
  // dates = dates as [ProsoVisDate, ProsoVisDate, ...ProsoVisDate[]];

  if (dates.length > 2) {
    console.error('there is more than two dates', dates);
  }

  return (
    <WrapEventDate>
      <ProsoVisDateLabel datation={dates[0]!} showTooltip={showTooltip} />
      <SpacedDateLabel datation={dates[1]!} showTooltip={showTooltip} />
    </WrapEventDate>
  );
};
