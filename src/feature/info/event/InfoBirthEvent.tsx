import React from 'react';
import { Plus, Icon } from '@primer/octicons-react';
import { BirthEvent } from '../../../data';

type InfoBirthProps = {
  event: BirthEvent;
  fromActor: boolean;
  children: (icon: Icon, content: string) => JSX.Element;
};

const InfoBirth: React.FC<InfoBirthProps> = ({ event, fromActor, children }) =>
  children(
    Plus,
    `Naissance ${
      fromActor
        ? event.localisation && ` à ${event.localisation.label}`
        : ` de ${event.actor.label}`
    }`
  );
export default InfoBirth;
