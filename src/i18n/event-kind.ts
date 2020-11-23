const fr: _.Dictionary<string> = {
  Birth: 'Naissance',
  Death: 'Décès',
  Education: 'Enseignement',
  ObtainQualification: 'Obtention de qualité',
  PassageExamen: "Passage d'un examen",
  Retirement: 'Retraite',
  SuspensionActivity: "Suspension d'activité",
};

function eventKind(kind: string) {
  return fr[kind];
}
export default eventKind;
