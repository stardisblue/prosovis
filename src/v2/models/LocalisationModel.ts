import {
  ProsoVisLocalisations,
  ProsoVisLocalisation,
  ProsoVisPlace,
} from '../types/localisations';
import { mapValues, filter } from 'lodash/fp';
export type RichLocalisation = {
  value: ProsoVisLocalisation;
  localisation: ProsoVisPlace | null;
};

export type RichRequiredLocalisation = {
  value: ProsoVisLocalisation;
  localisation: ProsoVisPlace & { lat: number; lng: number };
};
export class LocalisationModel {
  source: ProsoVisLocalisations;
  private cache: {
    [k: string]: RichLocalisation;
  } = {};

  constructor(localisations: ProsoVisLocalisations) {
    this.source = localisations;
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getAllLocalised = this.getAllLocalised.bind(this);
  }

  getAll() {
    return mapValues(({ id }) => this.get(id)!, this.source.index);
  }

  getAllLocalised() {
    return filter(
      (v) =>
        v.localisation !== null &&
        v.localisation.lat !== null &&
        v.localisation.lng !== null,
      this.getAll()
    ) as RichRequiredLocalisation[];
  }

  get(id: ProsoVisLocalisation['id']) {
    const cached = this.cache[id];
    if (cached) return cached;

    const l = this.source.index[id];
    if (l) {
      if (l.kind === 'CollectiveActor') {
        this.cache[id] = {
          value: l,
          localisation: l.localisation
            ? (this.source.index[l.localisation] as ProsoVisPlace)
            : null,
        };

        return this.cache[id];
      }

      this.cache[id] = { value: l, localisation: l };
      return this.cache[id];
    }

    return null;
  }
}
