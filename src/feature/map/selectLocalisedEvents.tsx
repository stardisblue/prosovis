import { createSelector } from '@reduxjs/toolkit';
import { transform } from 'lodash/fp';
import { selectMaskedEvents } from '../../selectors/mask';

import { ProsoVisDetailRichEvent } from '../../v2/types/events';

export const selectLocalisedEvents = createSelector(
  selectMaskedEvents,
  (events) =>
    transform(
      (acc, e) => {
        const l = e.place;
        if (l && l.lat && l.lng)
          acc.push(e as Required<ProsoVisDetailRichEvent>);
      },
      [] as Required<ProsoVisDetailRichEvent>[],
      events
    )
);
