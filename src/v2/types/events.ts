export type ComputedLabels = {
  actorNote: string;
  placeNote: string;
  actorNoteAndGrouped: string;
  placeNoteAndGrouped: string;
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
  url: { [k: string]: string };
  uri: string;
  index: { [k: string]: ProsoVisEvent[] };
};
