import { ProsoVisActor } from '../v2/types/actors';
import { ActorCard, NamedPlace, AnyEvent } from './models';

export type SiprojurisActor = ActorCard & {
  shortLabel: string;
};

export function isSiprojurisActor(
  object: any
): object is SiprojurisActor | ProsoVisActor {
  return object?.kind === 'Actor' && typeof object?.shortLabel === 'string';
}

export type SiprojurisNamedPlace = NamedPlace;

export type SipErrorKinds =
  | 'DatationLength'
  | 'DatationType'
  | 'DatationBeforeBirth'
  | 'DatationBeforeDeath'
  | 'EventDuplication'
  | 'MissingLocalisation'
  | 'MissingCollectiveActor'
  | 'MissingCollectiveActorLocalisation'
  | 'MissingCollectiveActorLocalisationCoordinates'
  | 'MissingLocalisationCoordinates';

export type SipError = {
  kind: SipErrorKinds;
  message: string;
  value: string[] | string | number;
  expected?: any;
  level: 'Error' | 'Warning' | 'Info';
};

export type SiprojurisEvent = Readonly<
  AnyEvent<SiprojurisActor, SiprojurisNamedPlace>
> & { id: string; computed?: ComputedLabels; errors?: SipError[] };

export type ComputedLabels = {
  actorNote: string;
  placeNote: string;
  actorNoteAndGrouped?: string;
  placeNoteAndGrouped?: string;
};
