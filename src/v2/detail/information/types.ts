import { ProsoVisActor } from '../../types/actors';
import {
  ProsoVisDate,
  ProsoVisDetailRichEvent,
  ProsoVisEvent,
} from '../../types/events';
import { ProsoVisPlace } from '../../types/localisations';

export type Interactive<T> = T & {
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};

export type InformationActorGroup = {
  kind: 'Actor';
  group: ProsoVisActor;
  events: Interactive<ProsoVisDetailRichEvent>[];
};

export type InformationPlaceGroup = {
  kind: 'Place';
  group: ProsoVisPlace;
  events: Interactive<ProsoVisDetailRichEvent>[];
};
export type InformationGroup = InformationActorGroup | InformationPlaceGroup;
export type EventGroup<
  T extends
    | Interactive<ProsoVisDetailRichEvent>
    | Interactive<ProsoVisDetailRichEvent>[]
> = {
  id: ProsoVisEvent['id'];
  kind: ProsoVisEvent['kind'];
  events: T;
  start: ProsoVisDate;
  end: ProsoVisDate;
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};
