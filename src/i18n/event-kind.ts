import { AnyEvent } from '../data';

const fr: { [k in AnyEvent['kind']]: string } = {
  Birth: 'Naissance',
  Death: 'Décès',
  Education: 'Enseignement',
  ObtainQualification: "Obtention d'une qualification",
  PassageExamen: "Passage d'un examen",
  Retirement: 'Retraite',
  SuspensionActivity: 'Congé',
};

function eventKind(kind: AnyEvent['kind']) {
  return fr[kind];
}
export default eventKind;
