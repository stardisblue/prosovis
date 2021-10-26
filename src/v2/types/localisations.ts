export type ProsoVisCollective = {
  kind: 'Localisation';
  id: string;
  label: string;
  uri?: string | null;
  localisation?: ProsoVisPlace['id'] | null;
};

export type ProsoVisPlace = {
  kind: 'Place';
  id: string;
  label: string;
  uri?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type ProsoVisLocalisation = ProsoVisCollective | ProsoVisPlace;

export type ProsoVisLocalisations = _.Dictionary<ProsoVisLocalisation>;
