import React from 'react';
import styled from 'styled-components/macro';
import { TriangleRightIcon } from '@primer/octicons-react';
import { ProsoVisDate } from '../types/events';
import { Popper } from '../../components/ui/Popper';

const StyledTime = styled.time`
  white-space: nowrap;
  font-size: 12px;
`;

export const ProsoVisDateLabel: React.FC<{
  datation: ProsoVisDate;
  showTooltip?: boolean;
}> = function ({ datation: d, showTooltip = true }) {
  if (showTooltip) {
    return <Popper content={`${d.kind} - ${d.value}`} children={children} />;
  }

  return (
    <StyledTime
      aria-label={`${d.kind} - ${d.value}`}
      dateTime={d.value}
      data-uri={d.uri}
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

export const ProsoVisDates: React.FC<{
  dates: ProsoVisDate[];
  showTooltip?: boolean;
}> = function ({ dates, showTooltip }) {
  if (dates.length === 1) {
    return (
      <EventDateBase>
        <ProsoVisDateLabel datation={dates[0]} showTooltip={showTooltip} />
      </EventDateBase>
    );
  }

  if (dates.length > 2) {
    console.error('there is more than two dates', dates);
  }
  return (
    <EventDateBase>
      <ProsoVisDateLabel datation={dates[0]} showTooltip={showTooltip} />
      <TriangleRightIcon />
      <ProsoVisDateLabel datation={dates[1]} showTooltip={showTooltip} />
    </EventDateBase>
  );
};
