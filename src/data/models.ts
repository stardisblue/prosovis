export type PrimaryKey = number | string;

export type Ressource = {
  id: PrimaryKey;
  url: string;
  uri: string;
  label: string;
};
export type ActorCard = Ressource & { kind: 'Actor'; id: number };
type AbstractObject = Ressource;

export type Nullable<T> = T | null;
export type Datation = Ressource & {
  label:
    | 'Date unique'
    | 'Date de début'
    | 'Date de fin'
    | "Date unique (jusqu'à, inclus)";
  value: string;
  clean_date: string;
};

export type Event = Ressource & {
  // kind: string;
  datation: Datation[];
  created: Nullable<string>;
  creator: Nullable<string>;
};

export type LocalisedEvent<T extends NamedPlace> = Event & {
  localisation: Nullable<T>;
};

export type NamedPlace = Ressource & {
  kind: 'NamedPlace';
  lat: Nullable<string>;
  lng: Nullable<string>;
};

export type BirthEvent<
  A extends ActorCard,
  T extends NamedPlace
> = LocalisedEvent<T> & {
  kind: 'Birth';
  actor: A;
};

export type DeathEvent<
  A extends ActorCard,
  T extends NamedPlace
> = LocalisedEvent<T> & {
  kind: 'Death';
  actor: A;
};

export type SuspensionActivityEvent<A extends ActorCard> = Event & {
  kind: 'SuspensionActivity';
  actor: A;
  abstract_object: Nullable<AbstractObject>;
};

export type CollectiveActor<T extends NamedPlace> = Ressource & {
  localisation: Nullable<T>;
  creation: Nullable<T>;
  date_creation: Datation[];
  date_localisation: Datation[];
};

export type SocialCharacteristic = Ressource;

export type EducationEvent<
  A extends ActorCard,
  T extends NamedPlace
> = LocalisedEvent<T> & {
  kind: 'Education';
  actor: A;
  abstract_object: Nullable<AbstractObject>;
  collective_actor: CollectiveActor<T>;
  social_char_exerce: SocialCharacteristic;
  social_char_typer: Nullable<SocialCharacteristic>;
};

export type ExamenEvent<
  A extends ActorCard,
  T extends NamedPlace
> = LocalisedEvent<T> & {
  kind: 'PassageExamen';
  actor_evalue: Nullable<A>;
  actor_evaluer: Nullable<A>;
  abstract_object: AbstractObject;
  collective_actor: CollectiveActor<T>;
};

export type DirectionalExamenEvent<
  A extends ActorCard,
  T extends NamedPlace
> = ExamenEvent<A, T> & {
  actor: A;
};

export type ObtainQualificationEvent<
  A extends ActorCard,
  T extends NamedPlace
> = Event & {
  kind: 'ObtainQualification';
  social_characteristic: Nullable<SocialCharacteristic>;
  collective_actor: Nullable<CollectiveActor<T>>;
  passage_examen: Nullable<ExamenEvent<A, T>>;
  actor: A;
};

export type RetirementEvent<A extends ActorCard> = Event & {
  kind: 'Retirement';
  actor: A;
};

export type Actor = ActorCard & {
  kind: 'Actor';
  birth_set: BirthEvent<ActorCard, NamedPlace>[];
  death_set: DeathEvent<ActorCard, NamedPlace>[];
  suspensionactivity_set: SuspensionActivityEvent<ActorCard>[];
  education_set: EducationEvent<ActorCard, NamedPlace>[];
  est_evalue_examen: ExamenEvent<ActorCard, NamedPlace>[];
  evaluer_examen: ExamenEvent<ActorCard, NamedPlace>[];
  obtainqualification_set: ObtainQualificationEvent<ActorCard, NamedPlace>[];
  retirement_set: RetirementEvent<ActorCard>[];
};

export function isActor(object: any): object is Actor {
  return object.kind && object.kind === 'Actor';
}

export type AnyEvent<A extends ActorCard, T extends NamedPlace> =
  | BirthEvent<A, T>
  | DeathEvent<A, T>
  | SuspensionActivityEvent<A>
  | EducationEvent<A, T>
  | ObtainQualificationEvent<A, T>
  | RetirementEvent<A>
  | DirectionalExamenEvent<A, T>;

export type DeprecatedAnyEvent = AnyEvent<ActorCard, NamedPlace>;
