export type ProsoVisRelation = {
  actors: [string, string];
  loc: string;
  events: string[];
  weight: number;
  order: number;
};

export type ProsoVisSignedRelation = Omit<ProsoVisRelation, 'actors'> & {
  id: string;
  source: string;
  target: string;
};

export type ProsoVisRelations = ProsoVisRelation[];
