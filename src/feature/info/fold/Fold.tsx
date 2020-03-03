import React, { useMemo, useState, useCallback } from 'react';

import { Ressource } from '../../../data';
import classnames from 'classnames';
import _ from 'lodash';

import Octicon, {
  ChevronDown,
  ChevronUp,
  Person,
  Location
} from '@primer/octicons-react';
import { Flex } from '../../../components/ui/Flex';
import KindGroup from '../KindGroup';
import { EventGroup, SelectedEvent } from '../models';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { useSelector } from 'react-redux';
import { StyledOcticon } from '../StyledOcticon';
import styled from 'styled-components/macro';

const EventsDiv = styled.div<{ height: string }>`
  margin-left: 0.8rem;
  min-height: 50px;
`;

// TODO griser personnes
// surlingé : survol
// gras: selectionné
// normal: normal
// grisé: filtré
// TODO ajouter un espacement entre normal et grisé
//
// carte: meme granularité que la timeline filtres selections synchronisés
// mettre une personne floue
// TODO mettre surbrillance tout ce qui est personne selectionnée
// griser timeline lors du survol sur les autres visus

// V0 :
// Barre de recherche globale : lieu & acteur
// synchro timeline-carte-information
// laisser le graphe grisé

// grouper par type d'evenement consécutifs dans le groupe, bla bla bla
type FoldProps = {
  events: EventGroup[];
  kind: 'Actor' | 'NamedPlace';
  title: any;
};

export const Fold: React.FC<FoldProps> = function({ events, kind, title }) {
  const [show, setShow] = useState(false);

  const handleClick = useCallback(() => setShow(s => !s), []);

  return (
    <>
      <Flex
        col
        justify="between"
        className="b--moon-gray ph1 pt1 flex-grow-0"
        items="baseline"
        onClick={handleClick}
      >
        {title}
      </Flex>

      {show && (
        <EventsDiv
          className="bl bw1 bb b--moon-gray overflow-y-auto"
          height={events.length > 12 ? '600px' : 'auto'}
        >
          {events.map(e => (
            <KindGroup key={e.id} {...e} origin={kind} />
          ))}
        </EventsDiv>
      )}
    </>
  );
};

export default Fold;
