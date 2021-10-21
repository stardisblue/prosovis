export type ProsoVisCollective = {
  kind: 'Localisation';
  id: string;
  label: string;
  uri: string;
  localisation: ProsoVisPlace['id'] | null;
};

export type ProsoVisPlace = {
  kind: 'Place';
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
