import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { AnyEvent } from '../data';

type ColorContextProps = {
  border: d3.ScaleOrdinal<AnyEvent['kind'] | string, string>;
  color: d3.ScaleOrdinal<AnyEvent['kind'] | string, string>;
};

export const ColorContext = React.createContext<ColorContextProps>({} as any);

// TODO http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=7
export const useColorContext = function() {
  return useMemo(function() {
    const color = d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain([
        'PassageExamen',
        'Birth',
        'Education',
        'Retirement',
        'SuspensionActivity',
        'Death',
        'ObtainQualification'
      ])
      .range([
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f'
      ]);

    const border = d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain(color.domain())
      .range(
        color.range().map(d =>
          d3
            .color(d)!
            .darker(2)
            .toString()
        )
      );

    return {
      border,
      color
    };
  }, []);
};
