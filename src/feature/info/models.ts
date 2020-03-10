import { AnyEvent, Datation } from '../../data';

export type EventGroup<T extends SelectedEvent | SelectedEvent[]> = {
  id: AnyEvent['id'];
  kind: AnyEvent['kind'];
  events: T;
  start: Datation;
  end: Datation;
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};

export type SelectedEvent<T = AnyEvent> = T & {
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};
