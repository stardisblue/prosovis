import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { DeprecatedAnyEvent } from '../data/models';

type ColorContextProps = {
  border: d3.ScaleOrdinal<DeprecatedAnyEvent['kind'] | string, string>;
  color: d3.ScaleOrdinal<DeprecatedAnyEvent['kind'] | string, string>;
};

export const DeprecatedColorContext = React.createContext<ColorContextProps>(
  {} as any
);

// TODO http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=7
// TODO suspension activité: pause
// switch couleur par personne/ par type d'evenement
// voir mettre à jour le camembert
// et griser les liens de la carte lrosquel a couleur est par type d'evenement
export const useColorContext = function () {
  return useMemo(function () {
    const color = d3
      .scaleOrdinal<DeprecatedAnyEvent['kind'] | string, string>()
      .domain([
        'PassageExamen',
        'Birth',
        'Education',
        'Retirement',
        'SuspensionActivity',
        'Death',
        'ObtainQualification',
      ])
      .range([
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f',
      ]);

    const border = d3
      .scaleOrdinal<DeprecatedAnyEvent['kind'] | string, string>()
      .domain(color.domain())
      .range(color.range().map((d) => d3.color(d)!.darker(2).toString()));

    return {
      border,
      color,
    };
  }, []);
};
