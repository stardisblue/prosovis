export type ProsoVisErrorKinds =
  | 'EventDuplication'
  | 'DatationLength'
  | 'DatationType'
  | 'DatationBeforeBirth'
  | 'DatationBeforeDeath'
  | 'EventDuplication'
  | 'MissingLocalisation'
  | 'MissingCollectiveActor'
  | 'MissingCollectiveActorLocalisation'
  | 'MissingCollectiveActorLocalisationCoordinates'
  | 'MissingLocalisationCoordinates';
export type ProsoVisError = {
  kind: ProsoVisErrorKinds;
  message: string;
  value: string[] | string | number;
  expected?: any;
  level: 'Error' | 'Warning' | 'Info';
};
