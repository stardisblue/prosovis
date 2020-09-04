import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { useFlatClick } from '../../../hooks/useClick';
import { IconSpacerPointer } from '../IconSpacer';
import styled from 'styled-components/macro';

export const Note: React.FC<{
  title: JSX.Element | string;
  flat?: boolean;
  defaultToggleState?: boolean;
}> = function ({ title, flat = false, defaultToggleState = false, children }) {
  const Base = flat ? React.Fragment : 'div';

  const [show, setShow] = useState(defaultToggleState);
  const handleToggle = useFlatClick(() => {
    setShow((s) => !s);
  });

  return (
    <Base>
      <NoteTitle>
        {title}
        <IconSpacerPointer {...handleToggle} spaceRight={false}>
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

const NoteTitle = styled.div`
  display: flex;
`;

export const NoteContent: React.FC = function ({ children }) {
  return <>{children}</>;
};
