export type ProsoVisCollective = {
  kind: 'CollectiveActor';
  id: string;
  label: string;
  uri: string;
  localisation: ProsoVisLocalisation['id'] | null;
};

export type ProsoVisPlace = {
  kind: 'NamedPlace';
  id: string;
  label: string;
  uri: string;
  lat: number | null;
  lng: number | null;
};

export type ProsoVisLocalisation = ProsoVisCollective | ProsoVisPlace;

export type ProsoVisLocalisations = {
  url: _.Dictionary<string>;
  uri: string;
  index: _.Dictionary<ProsoVisLocalisation>;
};
