import { AnyEvent, Datation } from '../../data';

export type EventGroup = {
  id: AnyEvent['id'];
  kind: AnyEvent['kind'];
  events: SelectedEvent | SelectedEvent[];
  start: Datation;
  end: Datation;
  filtered?: boolean;
  selected?: boolean;
};

export type SelectedEvent<T = AnyEvent> = T & {
  selected?: boolean;
  filtered?: boolean;
};
