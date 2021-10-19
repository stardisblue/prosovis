import { ProsoVisActor } from '../../types/actors';
import {
  ProsoVisDate,
  ProsoVisDetailRichEvent,
  ProsoVisEvent,
} from '../../types/events';
import { ProsoVisLocalisation } from '../../types/localisations';

export type Interactive<T> = T & {
  highlighted?: boolean;
  selected?: boolean;
  masked?: boolean;
};

export type InformationGroup<T extends ProsoVisActor | ProsoVisLocalisation> = {
  group: T;
  events: Interactive<ProsoVisDetailRichEvent>[];
};
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
