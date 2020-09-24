import { SiprojurisEvent } from '../../data/sip-models';
import { Datation } from '../../data/models';

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

export type SelectedEvent<T = SiprojurisEvent> = T & {
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};
