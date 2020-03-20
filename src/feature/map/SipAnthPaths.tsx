import React, { useMemo, useRef } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLocalisedEvents } from './selectLocalisedEvents';
import _ from 'lodash';
import { antPath } from 'leaflet-ant-path';
import { NamedPlace } from '../../data';
import { selectSwitchActorColor } from '../../selectors/switch';

const AntPath: React.FC<{
  $layer: React.MutableRefObject<any>;
  id: string;
  events: { localisation: NamedPlace }[];
}> = function({ id, $layer, events }) {
  const color = useSelector(selectSwitchActorColor);
  const options = useMemo(
    () => ({
      color: color ? color(id) : '#6c757d',
      pulseColor: '#FFFFFF',
      pane: 'markerPane'
      // opacity: 1
    }),
    [color, id]
  );

  const $path = useRef<any>();
  if ($path.current === undefined) {
    $path.current = antPath(
      _.map<{ localisation: NamedPlace }, [number, number]>(
        events,
        ({ localisation: { lat, lng } }) => [+lat!, +lng!]
      ),
      options
    );
  }

  useEffect(() => {
    const path = antPath(
      _.map<{ localisation: NamedPlace }, [number, number]>(
        events,
        ({ localisation: { lat, lng } }) => [+lat!, +lng!]
      ),
      options
    );

    $path.current = path;
    $layer.current.addLayer(path);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $layer.current.removeLayer(path);
    };
    // ignoring options update
    // eslint-disable-next-line
  }, [events]);

  useEffect(() => {
    $path.current.setStyle(options);
  }, [options]);

  return null;
};

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
}> = function({ $map, $layer }) {
  const groupLayer = useRef<any>();
  if (groupLayer.current === undefined) {
    groupLayer.current = L.layerGroup(undefined, { pane: 'markerPane' });
  }
  useEffect(function() {
    $layer.current.addLayer(groupLayer.current);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $layer.current.removeLayer(groupLayer.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const events = useSelector(selectLocalisedEvents);

  const groups = useMemo(
    () =>
      _(events)
        .orderBy('datation.clean_date')
        .sortedUniqBy('localisation')
        .groupBy('actor')
        .value(),
    [events]
  );

  return (
    <>
      {_.map(groups, (events, key) => (
        <AntPath key={key} id={key} $layer={groupLayer} events={events} />
      ))}
    </>
  );
};

// alpha

export default SipAnthPaths;
