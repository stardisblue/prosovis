import React, { useContext } from 'react';
import L from 'leaflet';

export type LeafletContextProps = {
  top: L.Map;
  current: L.Map | L.LayerGroup<any>;
};
const LeafletContext = React.createContext<LeafletContextProps>({} as any);

export const useLeaflet = (): LeafletContextProps => useContext(LeafletContext);

export const LeafletProvider = LeafletContext.Provider;
