import {
  DeathEvent,
  Nullable,
  NamedPlace,
  AnyEvent,
  EducationEvent,
  Ressource
} from '../../../data';

const getLocalisationString = function(loc: Nullable<NamedPlace>) {
  return loc ? 'à ' + loc.label : '';
};

const getActorName = function(e: AnyEvent) {
  return 'de ' + e.actor.label;
};

export const getDeathInfo = function(event: DeathEvent, fromActor: boolean) {
  return 'Décès ' + fromActor
    ? getLocalisationString(event.localisation)
    : getActorName(event);
};

function getLabel<
  K extends string,
  F extends Nullable<Ressource>,
  E extends { [P in K]: F }
>(event: E, key: K): string | undefined {
  return event[key]?.label;
}

export const getEducationInfo = function(
  event: EducationEvent,
  fromActor: boolean
) {
  const matiere = getLabel(event, 'abstract_object');
  const organism = getLabel(event, 'collective_actor');
  if (fromActor) {
    return (
      'Enseigne' + (matiere && ` "${matiere}"`) + (organism && ` à ${organism}`)
    );
  } else {
    return (
      getLabel(event, 'actor') +
      ' enseigne' +
      (matiere && ` "${matiere}"`) +
      (organism && ` à ${organism}`)
    );
  }
};
