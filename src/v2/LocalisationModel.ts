import {
  ProsoVisLocalisations,
  ProsoVisLocalisation,
  ProsoVisPlace,
} from './types/localisations';
export type RichLocalisation = {
  value: ProsoVisLocalisation;
  localisation: ProsoVisPlace | null;
};
export class LocalisationModel {
  source: ProsoVisLocalisations;
  cache: {
    [k: string]: RichLocalisation;
  } = {};

  constructor(localisations: ProsoVisLocalisations) {
    this.source = localisations;
    this.get = this.get.bind(this);
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
