import { AnyEvent } from '../../../data';
import showificator from './showificator';

function getEventInfo(
  event: AnyEvent,
  fromActor: boolean,
  isSubGroup?: boolean
) {
  const top = (str: string) => (isSubGroup ? '' : str);
  const act = (inside: string, notin: string) => (fromActor ? inside : notin);
  switch (event.kind) {
    case 'Birth': {
      const _ = showificator(event);
      return top('Naissance') + act(_` à ${'localisation'}`, _` de ${'actor'}`);
    }
    case 'Death': {
      const _ = showificator(event);
      return top('Décès') + act(_` à ${'localisation'}`, _` de ${'actor'}`);
    }
    case 'Education': {
      const _ = showificator(event);
      return (
        act(top('Enseigne'), _`${'actor'}` + top(' enseigne')) +
        _` "${'abstract_object'}"` +
        _` à ${'collective_actor'}`
      );
    }
    case 'ObtainQualification': {
      const _ = showificator(event);
      return (
        act(
          top('Obtient la qualité'),
          _`${'actor'}` + top(' obtient la qualité')
        ) +
        _` "${'social_characteristic'}"` +
        _` à ${'collective_actor'}`
      );
    }
    case 'PassageExamen': {
      const _ = showificator(event);
      const eva = (yes: string, no: string) =>
        event.actor.id === event.actor_evaluer.id ? yes : no;
      const rest = _` pour ${'abstract_object'}` + _` à ${'collective_actor'}`;
      return (
        act(
          eva(_`Evalue ${'actor_evalue'}`, _`Evalué par ${'actor_evaluer'}`),
          _`${'actor'}` +
            eva(_` evalue ${'actor_evalue'}`, _` évalué par ${'actor_evaluer'}`)
        ) + rest
      );
    }
    case 'Retirement': {
      const _ = showificator(event);
      return 'Départ en retraite' + act('', _` de ${'actor'}`);
    }
    case 'SuspensionActivity': {
      const _ = showificator(event);
      return act('', _`${'actor'}`) + _`${'abstract_object'}`;
    }
  }
}

export default getEventInfo;