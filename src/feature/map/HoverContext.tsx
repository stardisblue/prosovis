import React from 'react';
type HoverContextProps = {
  id: string | null;
  cancel: any;
};

export const HoverContext = React.createContext<
  React.MutableRefObject<HoverContextProps>
>({} as any);
