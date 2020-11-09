import React from 'react';
import styled from 'styled-components/macro';
import { createSelector } from 'reselect';
import { selectAllEvents } from '../../selectors/events';
import { pipe } from 'lodash/fp';
import { flatMap } from 'lodash';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';

export const Timeline = styled.div`
  height: 200px;
`;

export const selectDiscrete = createSelector(selectAllEvents, function (
  events
) {
  return pipe(flatMap);
  // return _(events)
  //   .flatMap<
  //     | {
  //         kind: SiprojurisEvent['kind'] | '';
  //         actor: PrimaryKey | null;
  //         time: Date;
  //       }
  //     | undefined
  //   >((e) => {
  //     if (e.datation.length === 2) {
  //       const [start, end] = map(
  //         pipe(get('clean_date'), (d) => new Date(d), d3.timeYear.floor),
  //         e.datation
  //       );

  //       return d3.timeYears(start, d3.timeDay.offset(end, 1)).map((time) => ({
  //         kind: e.kind,
  //         actor: e.actor.id,
  //         time,
  //       }));
  //     } else if (e.datation.length === 1) {
  //       return {
  //         kind: e.kind,
  //         actor: e.actor.id,
  //         time: d3.timeYear(moment(e.datation[0].clean_date).toDate()),
  //       };
  //     }
  //   })
  //   .concat(
  //     d3.timeYear
  //       .range(new Date(1700, 0, 1), new Date(2000, 0, 1))
  //       .map((d) => ({ time: d, kind: '', actor: null }))
  //   )
  //   .groupBy('time');
});

const GlobalTimeline: React.FC = function () {
  const data = useSelector(selectAllEvents);

  return (
    <Loading finished={data}>
      <h3>WIP Timeline</h3>
      <Timeline>Hello world</Timeline>
    </Loading>
  );
};
export default GlobalTimeline;
