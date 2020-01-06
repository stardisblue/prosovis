export type PrimaryKey = number | string;

export type Ressource = {
  id: PrimaryKey;
  url: string;
  uri: string;
  label: string;
};
type ActorCard = Ressource;
type AbstractObject = Ressource;

export type Nullable<T> = T | null;
export type Datation = Ressource & {
  value: string;
  clean_date: string;
};

export type Event = Ressource & {
  kind: string;
  datation: Datation[];
  created: Nullable<string>;
  creator: Nullable<string>;
};

export type NamedPlace = Ressource & {
  kind: 'NamedPlace';
  lat: Nullable<string>;
  lng: Nullable<string>;
};

export type BirthEvent = Event & {
  actor: ActorCard;
  localisation: Nullable<NamedPlace>;
};

export type DeathEvent = Event & {
  actor: ActorCard;
  localisation: Nullable<NamedPlace>;
};

export type SuspensionActivityEvent = Event & {
  actor: ActorCard;
  abstract_object?: AbstractObject;
};

export type CollectiveActor = Ressource & {
  localisation: Nullable<NamedPlace>;
  creation: Nullable<NamedPlace>;
  date_creation: Datation[];
  date_localisation: Datation[];
};

export type SocialCharacteristic = Ressource;

export type EducationEvent = Event & {
  actor: ActorCard;
  abstract_object: Nullable<AbstractObject>;
  collective_actor: CollectiveActor;
  social_char_exerce: SocialCharacteristic;
  social_char_typer: Nullable<SocialCharacteristic>;
};

export type ExamenEvent = Event & {
  actor_evalue: ActorCard;
  actor_evaluer: ActorCard;
  abstract_object: AbstractObject;
  collective_actor: CollectiveActor;
};

export type DirectionalExamenEvent = ExamenEvent & {
  actor: ActorCard;
};

export type ObtainQualificationEvent = Event & {
  social_characteristic: Nullable<SocialCharacteristic>;
  collective_actor: Nullable<CollectiveActor>;
  passage_examen: Nullable<ExamenEvent>;
  actor: ActorCard;
};

export type RetirementEvent = Event & {
  actor: ActorCard;
};

export type Actor = ActorCard & {
  kind: 'Actor';
  birth_set: BirthEvent[];
  death_set: DeathEvent[];
  suspensionactivity_set: SuspensionActivityEvent[];
  education_set: EducationEvent[];
  est_evalue_examen: ExamenEvent[];
  evaluer_examen: ExamenEvent[];
  obtainqualification_set: ObtainQualificationEvent[];
  retirement_set: RetirementEvent[];
};

export function isActor(object: any): object is Actor {
  return object.kind && object.kind === 'Actor';
}

export type AnyEvent =
  | BirthEvent
  | DeathEvent
  | SuspensionActivityEvent
  | EducationEvent
  | ObtainQualificationEvent
  | RetirementEvent
  // | ExamenEvent
  | DirectionalExamenEvent;
