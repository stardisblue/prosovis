import { ProsoVisActor } from './actors';
import { ProsoVisLocalisation, ProsoVisPlace } from './localisations';

export type ComputedLabels = {
  actorNote?: string;
  placeNote?: string;
  actorNoteAndGrouped?: string;
  placeNoteAndGrouped?: string;
};

export type ProsoVisDate = {
  kind: string;
  label: string;
  value: string;
  uri?: string;
};

export type ProsoVisEvent = {
  kind: string;
  id: string;
  label: string;
  actor: string;
  localisation?: string | null;
  datation?:
    | []
    | [ProsoVisDate]
    | [ProsoVisDate, ProsoVisDate]
    | ProsoVisDate[]
    | null;
  uri?: string;
  computed?: ComputedLabels;
};

export type RichEvent = {
  actor: ProsoVisActor;
  event: ProsoVisEvent;
  localisation?: ProsoVisLocalisation;
  place?: ProsoVisPlace;
};

export type ProsoVisDetailRichEvent = RichEvent & {
  errors?: any;
};
