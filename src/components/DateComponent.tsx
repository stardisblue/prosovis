import React from 'react';
import styled from 'styled-components/macro';
import { TriangleRightIcon } from '@primer/octicons-react';
import { Datation } from '../data/models';
import { CenteredTopPopper } from './Popper';

const Base = styled.span`
  white-space: nowrap;
  font-size: 12px;
`;

export const DateLabel: React.FC<{
  datation: Datation;
  showTooltip?: boolean;
}> = function ({ datation: d, showTooltip = true }) {
  const time = (
    <time dateTime={d.clean_date} data-uri={d.uri}>
      {d.value}
    </time>
  );

  if (showTooltip) {
    return (
      <CenteredTopPopper
        content={`${d.label} - ${d.clean_date}`}
        children={children}
      />
    );
  } else {
    return <Base title={`${d.label} - ${d.clean_date}`}>{time}</Base>;
  }

  function children(
    $ref: React.MutableRefObject<HTMLSpanElement>,
    show: () => void,
    hide: () => void
  ) {
    return (
      <Base
        ref={$ref}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        {time}
      </Base>
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
