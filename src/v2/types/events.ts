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
  id: string;
  label: string;
  value: string;
  uri: string;
};

export type ProsoVisEvent = {
  kind: string;
  id: string;
  label: string;
  actor: string;
  localisation: string | null;
  datation: ProsoVisDate[];
  uri: string;
  created: string;
  creator: string;
  computed?: ComputedLabels;
};

export type ProsoVisEvents = {
  url: _.Dictionary<string>;
  uri: string;
  index: _.Dictionary<ProsoVisEvent[]>;
};

export type RichEvent = {
  event: ProsoVisEvent;
  localisation?: ProsoVisLocalisation;
  place?: ProsoVisPlace;
};

export type ProsoVisDetailRichEvent = RichEvent & {
  actor: ProsoVisActor;
  errors?: any;
};
