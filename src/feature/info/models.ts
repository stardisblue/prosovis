import { SiprojurisEvent } from '../../data/sip-models';
import { AnyEvent, Datation } from '../../data/models';

export type EventGroup<
  T extends SelectedEvent<SiprojurisEvent> | SelectedEvent<SiprojurisEvent>[]
> = {
  id: SiprojurisEvent['id'];
  kind: SiprojurisEvent['kind'];
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
