import { ActorCard, NamedPlace, Nullable, AnyEvent } from './models';

export type SiprojurisActor = Readonly<
  ActorCard & {
    shortLabel: string;
  }
>;

export function isSiprojurisActor(object: any): object is SiprojurisActor {
  return object?.kind === 'Actor' && typeof object?.shortLabel === 'string';
}

export type SiprojurisNamedPlace = Readonly<NamedPlace>;

export type SipErrorKinds = 'DatationLength' | 'DatationType';

export type SipError = {
  kind: SipErrorKinds;
  message: string;
  value: string | number;
  expected?: any;
  level: 'Error' | 'Warning' | 'Info';
};

export type SiprojurisEvent = Readonly<
  AnyEvent & {
    actor: SiprojurisActor;
    localisation: Nullable<SiprojurisNamedPlace>;
  }
> & { computed?: ComputedLabels; errors?: SipError[] };

export type ComputedLabels = {
  actorNote: string;
  placeNote: string;
  actorNoteAndGrouped?: string;
  placeNoteAndGrouped?: string;
};
