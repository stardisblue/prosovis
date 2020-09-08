import React from 'react';
import { Datation } from '../../data/models';
import { flatMap } from 'lodash';
export const EventDates: React.FC<{
  dates: Datation[];
}> = function ({ dates }) {
  return (
    <div className="tr">
      {flatMap(dates, (d, index, array) =>
        array.length - 1 !== index ? (
          [
            <abbr
              key={d.id}
              className="nowrap"
              title={d.label + ' - ' + d.clean_date}
            >
              <time dateTime={d.clean_date} data-uri={d.uri}>
                {d.value}
              </time>
            </abbr>,
            <React.Fragment key={d.id + 'interspace'}> - </React.Fragment>,
          ]
        ) : (
          <abbr
            key={d.id}
            className="nowrap"
            title={d.label + ' - ' + d.clean_date}
          >
            <time dateTime={d.clean_date} data-uri={d.uri}>
              {d.value}
            </time>
          </abbr>
        )
      )}
    </div>
  );
};
