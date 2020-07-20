import { AnyEvent } from '../data';

const fr: { [k in AnyEvent['kind']]: string } = {
  Birth: 'Naissance',
  Death: 'Décès',
  Education: 'Enseignement',
  ObtainQualification: 'Obtention de qualité',
  PassageExamen: "Passage d'un examen",
  Retirement: 'Retraite',
  SuspensionActivity: "Suspension d'activité",
};

function eventKind(kind: AnyEvent['kind']) {
  return fr[kind];
}
export default eventKind;
