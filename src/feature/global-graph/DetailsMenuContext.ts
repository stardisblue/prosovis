import React, { useState } from 'react';
type Menu = {
  actor: string;
  ref: SVGGElement;
  x: number;
  y: number;
  width: number;
  height: number;
} | null;
type DetailMenuProps = {
  menuTarget: Menu;
  setMenuTarget: React.Dispatch<React.SetStateAction<Menu>>;
};
export const DetailsMenuContext = React.createContext<DetailMenuProps>(
  {} as any
);

export const useDetailsMenuContext = function (): DetailMenuProps {
  const [menuTarget, setMenuTarget] = useState<Menu>(null);

  return {
    menuTarget,
    setMenuTarget,
  };
};
export default DetailsMenuContext;
