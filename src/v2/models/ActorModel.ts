import { ProsoVisActors, ProsoVisActor } from '../types/actors';

export class ActorModel {
  source: ProsoVisActors;

  constructor(source: ProsoVisActors) {
    this.source = source;
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
  }

  getAll() {
    return this.source.index;
  }

  get(id: ProsoVisActor['id']) {
    return this.source.index[id];
  }

  static getLabel(a: ProsoVisActor, short: boolean = false) {
    return short ? a.shortLabel || a.label : a.label;
  }
}
