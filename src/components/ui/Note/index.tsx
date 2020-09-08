import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useFlatClick } from '../../../hooks/useClick';
import { StyledFlex } from '../Flex/styled-components';
import { IconSpacerPointer } from '../IconSpacer';

export const Note: React.FC<{
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  title: JSX.Element | string;
  underline?: boolean;
  defaultToggleState?: boolean;
}> = function ({ title, as = 'div', defaultToggleState = false, children }) {
  const Base = as;
  const [show, setShow] = useState(defaultToggleState);
  const handleToggle = useFlatClick(() => {
    setShow((s) => !s);
  });

  return (
    <Base>
      <NoteTitle>
        {title}
        <IconSpacerPointer {...handleToggle} spaceLeft>
          {show ? (
            <ChevronUpIcon aria-label="Déplier" />
          ) : (
            <ChevronDownIcon aria-label="Replier" />
          )}
        </IconSpacerPointer>
      </NoteTitle>
      {show && <NoteContent>{children}</NoteContent>}
    </Base>
  );
};

const NoteTitle = StyledFlex;

export const NoteContent: React.FC = function ({ children }) {
  return <>{children}</>;
};
