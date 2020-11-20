export type ProsoVisActor = {
  kind: 'Actor';
  id: string;
  label: string;
  shortLabel?: string;
  uri: string;
};

export type ProsoVisActors = {
  url: string;
  uri: string;
  index: _.Dictionary<ProsoVisActor>;
};
