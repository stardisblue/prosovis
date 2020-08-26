import { ActorCard, NamedPlace, Event, Nullable, AnyEvent } from './index';

export type SiprojurisActor = ActorCard & {
  shortLabel: string;
};

export type SiprojurisNamedPlace = NamedPlace;

export type SiprojurisEvent = Event & {
  kind: AnyEvent['kind'];
  actor: SiprojurisActor;
  localisation: Nullable<SiprojurisEvent>;
  getLabel: (
    this: SiprojurisEvent,
    noteKind: SiprojurisActor['kind'] | SiprojurisNamedPlace['kind'],
    grouped: boolean
  ) => string;
  computed?: ComputedLabels;
};

export type ComputedLabels = {
  actorNote: string;
  placeNote: string;
  actorNoteAndGrouped?: string;
  placeNoteAndGrouped?: string;
};
