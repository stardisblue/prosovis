import { SiprojurisEvent } from '../../data/sip-typings';
import { AnyEvent, Datation } from '../../data/typings';

export type EventGroup<
  T extends SelectedEvent<SiprojurisEvent> | SelectedEvent<SiprojurisEvent>[]
> = {
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
