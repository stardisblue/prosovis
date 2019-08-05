import _ from 'lodash';

import { DataStore } from './store';
import { createSelector } from 'reselect';
import { Item } from './reducers/items';

export const getItems = (store: DataStore) => store.items;
export const getSelections = (store: DataStore) => store.selection;
export const getHovered = (store: DataStore) => store.hover;

export const getItemFullState = createSelector(
  getItems,
  getSelections,
  getHovered,
  (items, selection, hover) => {
    _.transform(
      items,
      (acc, value, key) => {
        acc[key] = {
          item: value,
          selected: selection.has(key),
          hover: hover === key
        };
      },
      {} as { [key: string]: { item: Item; selected: boolean; hover: boolean } }
    );
  }
);
