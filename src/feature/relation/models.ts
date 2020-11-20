import { ProsoVisSignedRelation } from '../../v2/types/relations';

export type ActorRelationsMap = Map<string, RelationMap>;

/**
 * @deprecated
 * @see ProsoVisActor
 */
export type RelationNodeType = {
  kind: string;
  id: string;
  label: string;
  uri: string;
  url: string;
};

/**
 * @deprecated
 * @see ProsoVisSignedRelation
 */
export type RelationEvent = {
  id: string;
  source: string;
  target: string;
  loc: string;
  events: string[];
  d: number;
  med: number;
};
export type RelationMap = Map<string, ProsoVisSignedRelation>;
export type LocEvents = [string, RelationMap];

export type Emphase = {
  actor: string;
  loc: string;
};
