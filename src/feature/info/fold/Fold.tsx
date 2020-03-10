import React, { useState, useCallback } from 'react';

import classnames from 'classnames';

import { Flex } from '../../../components/ui/Flex';
import styled from 'styled-components/macro';
import Octicon, { ChevronUp, ChevronDown } from '@primer/octicons-react';

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
  events: JSX.Element[];
  className?: string;
};

export const Fold: React.FC<FoldProps> = function({
  events,
  children,
  className
}) {
  const [show, setShow] = useState(false);

  const handleClick = useCallback(() => setShow(s => !s), []);

  return (
    <>
      <Flex
        col
        justify="between"
        className={classnames('b--moon-gray ph1 pt1 flex-grow-0', className)}
        items="baseline"
        onClick={handleClick}
      >
        {children}
        <Octicon
          className="ma1 flex-shrink-0"
          verticalAlign="text-bottom"
          icon={show ? ChevronUp : ChevronDown}
          ariaLabel={show ? 'Etendre' : 'Réduire'}
        />
      </Flex>

      {show && (
        <EventsDiv
          className="bl bw1 bb b--moon-gray overflow-y-auto"
          height={events.length > 12 ? '600px' : 'auto'}
        >
          {events}
        </EventsDiv>
      )}
    </>
  );
};

export default Fold;
