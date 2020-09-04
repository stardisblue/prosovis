import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { useFlatClick } from '../../../hooks/useClick';
import { IconSpacerPointer } from '../IconSpacer';

export const Note: React.FC<{
  title: JSX.Element | string;
  flat?: boolean;
  defaultToggleState?: boolean;
}> = function ({ title, flat = false, defaultToggleState = false, children }) {
  const Base = flat ? React.Fragment : 'section';

  const [show, setShow] = useState(defaultToggleState);
  const handleToggle = useFlatClick(() => {
    setShow((s) => !s);
  });

  return (
    <Base>
      <NoteTitle>
        {title}
        <IconSpacerPointer {...handleToggle}>
          {show ? (
            <ChevronUpIcon aria-label="DÃ©plier" />
          ) : (
            <ChevronDownIcon aria-label="Replier" />
          )}
        </IconSpacerPointer>
      </NoteTitle>
      {show && <NoteContent>{children}</NoteContent>}
    </Base>
  );
};

export const NoteTitle: React.FC = function ({ children }) {
  return <div>{children}</div>;
};

export const NoteContent: React.FC = function ({ children }) {
  return <>{children}</>;
};
