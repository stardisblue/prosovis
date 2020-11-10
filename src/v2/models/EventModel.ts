import { ProsoVisActor } from '../types/actors';
import { ProsoVisPlace } from '../types/localisations';
import { ProsoVisEvents, ProsoVisEvent } from '../types/events';
import { ActorModel } from './ActorModel';
import { LocalisationModel, RichLocalisation } from './LocalisationModel';

import { flatMap, map } from 'lodash/fp';

export type RichEvent = {
  value: ProsoVisEvent;
  actor: ProsoVisActor | null;
  localisation: RichLocalisation | null;
};

export class EventModel {
  source: ProsoVisEvents;
  localisationModel: LocalisationModel;
  actorModel: ActorModel;
  cache: {
    [k: string]: RichEvent;
  } = {};
  constructor(
    source: ProsoVisEvents,
    actorModel: ActorModel,
    localisationModel: LocalisationModel
  ) {
    this.source = source;
    this.actorModel = actorModel;
    this.localisationModel = localisationModel;
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }

  getEvents(actor: ProsoVisActor | ProsoVisActor['id']) {
    const id = typeof actor === 'string' ? actor : actor.id;

    return this.source.index[id];
  }

  getAll() {
    return flatMap((v) => map(this.get, v), this.source.index);
  }

  get(event: ProsoVisEvent) {
    if (this.cache[event.id]) return this.cache[event.id];
    const v = {
      value: event,
      actor: this.actorModel.get(event.actor),
      localisation: event.localisation
        ? this.localisationModel.get(event.localisation)
        : null,
    };
    this.cache[event.id] = v;
    return v;
  }

  static getLabel(
    event: ProsoVisEvent,
    noteKind: ProsoVisActor['kind'] | ProsoVisPlace['kind'],
    grouped: boolean = false
  ): string {
    if (event.computed) {
      const {
        actorNote,
        actorNoteAndGrouped,
        placeNote,
        placeNoteAndGrouped,
      } = event.computed;

      if (noteKind === 'Actor') {
        // fallback to actorNote
        return (grouped && actorNoteAndGrouped) || actorNote || event.label;
      } else if (noteKind === 'NamedPlace') {
        // fallback to placeNote
        return (grouped && placeNoteAndGrouped) || placeNote || event.label;
      }
    }
    // fallback to default labellisation
    return event.label;
  }
}