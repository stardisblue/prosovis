import { SiprojurisEvent } from '../data/sip-models';

const fr: { [k in SiprojurisEvent['kind']]: string } = {
  Birth: 'Naissance',
  Death: 'Décès',
  Education: 'Enseignement',
  ObtainQualification: 'Obtention de qualité',
  PassageExamen: "Passage d'un examen",
  Retirement: 'Retraite',
  SuspensionActivity: "Suspension d'activité",
};

function eventKind(kind: SiprojurisEvent['kind']) {
  return fr[kind];
}
export default eventKind;
