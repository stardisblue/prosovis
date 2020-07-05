import React, { useState } from 'react';
import { ActorCard } from '../../data';
type Menu = { actor: ActorCard; ref: SVGGElement };
type DetailMenuProps = {
  menuTarget?: Menu;
  setMenuTarget: React.Dispatch<React.SetStateAction<Menu | undefined>>;
};
export const DetailsMenuContext = React.createContext<DetailMenuProps>(
  {} as any
);

export const useDetailsMenuContext = function (): DetailMenuProps {
  const [menuTarget, setMenuTarget] = useState<Menu>();

  return {
    menuTarget,
    setMenuTarget,
  };
};
export default DetailsMenuContext;
