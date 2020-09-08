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

export type SiprojurisEvent = Readonly<
  AnyEvent & {
    actor: SiprojurisActor;
    localisation: Nullable<SiprojurisNamedPlace>;
  }
> & { computed?: ComputedLabels };

export type ComputedLabels = {
  actorNote: string;
  placeNote: string;
  actorNoteAndGrouped?: string;
  placeNoteAndGrouped?: string;
};
