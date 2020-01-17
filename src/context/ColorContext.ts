import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { AnyEvent } from '../data';

type ColorContextProps = {
  border: d3.ScaleOrdinal<AnyEvent['kind'] | string, string>;
  color: d3.ScaleOrdinal<AnyEvent['kind'] | string, string>;
};

export const ColorContext = React.createContext<ColorContextProps>({} as any);
export const useColorContext = function() {
  return useMemo(function() {
    const color = d3
      .scaleOrdinal<AnyEvent['kind'] | string, string>()
      .domain([
        'Birth',
        'Death',
        'Education',
        'PassageExamen',
        'SuspensionActivity',
        'ObtainQualification',
        'Retirement'
      ])
      .range((d3 as any).schemeTableau10);

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
