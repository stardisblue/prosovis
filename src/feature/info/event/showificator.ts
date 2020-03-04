import { Nullable, Ressource } from '../../../data';

const showificator = function<P extends string, E extends { [k in P]: E[P] }>(
  event: E
) {
  return function y(strings: TemplateStringsArray, label: keyof E) {
    return (event[label] as Nullable<Ressource>)?.label
      ? strings[0] + (event[label] as Nullable<Ressource>)?.label + strings[1]
      : '';
  };
};

export default showificator;
