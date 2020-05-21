import _ from 'lodash';

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
  // kind: string;
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
  kind: 'Birth';
  actor: ActorCard;
  localisation: Nullable<NamedPlace>;
};

export type DeathEvent = Event & {
  kind: 'Death';
  actor: ActorCard;
  localisation: Nullable<NamedPlace>;
};

export type SuspensionActivityEvent = Event & {
  kind: 'SuspensionActivity';
  actor: ActorCard;
  abstract_object: Nullable<AbstractObject>;
};

export type CollectiveActor = Ressource & {
  localisation: Nullable<NamedPlace>;
  creation: Nullable<NamedPlace>;
  date_creation: Datation[];
  date_localisation: Datation[];
};

export type SocialCharacteristic = Ressource;

export type EducationEvent = Event & {
  kind: 'Education';
  actor: ActorCard;
  abstract_object: Nullable<AbstractObject>;
  collective_actor: CollectiveActor;
  social_char_exerce: SocialCharacteristic;
  social_char_typer: Nullable<SocialCharacteristic>;
};

export type ExamenEvent = Event & {
  kind: 'PassageExamen';
  actor_evalue: ActorCard;
  actor_evaluer: ActorCard;
  abstract_object: AbstractObject;
  collective_actor: CollectiveActor;
};

export type DirectionalExamenEvent = ExamenEvent & {
  actor: ActorCard;
};

export type ObtainQualificationEvent = Event & {
  kind: 'ObtainQualification';
  social_characteristic: Nullable<SocialCharacteristic>;
  collective_actor: Nullable<CollectiveActor>;
  passage_examen: Nullable<ExamenEvent>;
  actor: ActorCard;
};

export type RetirementEvent = Event & {
  kind: 'Retirement';
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

export function getLocalisation(event: AnyEvent) {
  switch (event.kind) {
    case 'Birth':
    case 'Death':
      return event.localisation;
    case 'Education':
    case 'ObtainQualification':
    case 'PassageExamen':
      return (
        event.collective_actor &&
        (event.collective_actor.localisation || event.collective_actor.creation)
      );
    default:
      return null;
  }
}

export function getEvents(actor: Actor): AnyEvent[] {
  const events = [];
  events.push(
    ...actor.birth_set,
    ...actor.death_set,
    ...actor.education_set,
    ..._.map(actor.est_evalue_examen, ({ id, actor_evalue, ...rest }) => ({
      id: -id,
      ...rest,
      actor_evalue,
      actor: actor_evalue,
    })),
    ..._.map(actor.evaluer_examen, ({ actor_evaluer, ...rest }) => ({
      ...rest,
      actor_evaluer,
      actor: actor_evaluer,
    })),
    ...actor.retirement_set,
    ...actor.suspensionactivity_set,
    ...actor.obtainqualification_set
  );

  return _.map(events, (e) => {
    e.datation = _.sortBy(e.datation, 'clean_date');
    return e;
  });
}
