import { ProsoVisSignedRelation } from '../../v2/types/relations';

export type ActorRelationsMap = Map<string, RelationMap>;

export type RelationMap = Map<string, ProsoVisSignedRelation>;
export type LocEvents = [string, RelationMap];

export type Emphase = {
  actor: string;
  loc: string;
};
