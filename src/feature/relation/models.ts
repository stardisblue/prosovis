export type ActorRelationsMap = Map<number, RelationMap>;
export type RelationNodeType = {
  kind: string;
  id: number;
  label: string;
  uri: string;
  url: string;
};

export type RawRelationLink = {
  actors: [number, number];
  loc: number;
  events: number[];
  d: number;
  med: number;
};

export type RelationEvent = {
  id: string;
  source: number;
  target: number;
  loc: number;
  events: number[];
  d: number;
  med: number;
};
export type RelationMap = Map<string, RelationEvent>;
export type LocEvents = [number, RelationMap];

export type Emphase = {
  actor: number;
  loc: number;
};
