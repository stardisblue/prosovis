import React from 'react';
import { Datation } from '../data/models';
import { StyledFlex } from './ui/Flex/styled-components';

export const DateLabel: React.FC<{ datation: Datation }> = function ({
  datation: d,
}) {
  return (
    <time
      dateTime={d.clean_date}
      data-uri={d.uri}
      title={`${d.label} - ${d.clean_date}`}
    >
      {d.value}
    </time>
  );
};

export const EventDates: React.FC<{ dates: Datation[] }> = function ({
  dates,
}) {
  if (dates.length === 1) {
    return <DateLabel datation={dates[0]} />;
  }
  return (
    <StyledFlex>
      {dates.map((d) => (
        <DateLabel key={d.id} datation={d} />
      ))}
    </StyledFlex>
  );
};
