import React, { useRef, useContext } from 'react';
import L from 'leaflet';
import { useLeaflet } from './context';
import useMount from '../../hooks/useMount';

export type LeafletControlProps = L.Control.Layers;
const LeafletControl = React.createContext<LeafletControlProps>(null as any);

export const useControl = () => useContext(LeafletControl);

export const Control: React.FC = function ({ children }) {
  const l = useLeaflet();
  const $control = useRef(L.control.layers());

  useMount(() => {
    const control = $control.current;
    control.addTo(l.top);

    return () => {
      control.remove();
    };
  });

  return (
    <LeafletControl.Provider value={$control.current}>
      {children}
    </LeafletControl.Provider>
  );
};

export type LeafletAddControlProps = (layer: L.Layer) => L.Control.Layers;
const LeafletAddControl = React.createContext<LeafletAddControlProps | null>(
  null
);

export const useAddControl = () => useContext(LeafletAddControl);

export const ControlOverlay: React.FC<{
  name: string;
  checked?: boolean;
}> = function ({ name, checked = true, children }) {
  const l = useLeaflet();
  const control = useControl();
  return (
    <LeafletAddControl.Provider
      value={(layer) => {
        if (checked) layer.addTo(l.top);
        return control.addOverlay(layer, name);
      }}
    >
      {children}
    </LeafletAddControl.Provider>
  );
};

export const ControlBaseLayer: React.FC<{
  name: string;
  checked?: boolean;
}> = function ({ name, checked = false, children }) {
  const l = useLeaflet();
  const control = useControl();
  return (
    <LeafletAddControl.Provider
      value={(layer) => {
        if (checked) layer.addTo(l.top);
        return control.addBaseLayer(layer, name);
      }}
    >
      {children}
    </LeafletAddControl.Provider>
  );
};
