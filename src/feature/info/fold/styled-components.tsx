import { moongray } from '../../../components/ui/colors';

export type HighlightableProp = {
  highlighted: boolean;
};

export const highlightable = ({ highlighted }: HighlightableProp) =>
  highlighted && `background-color: ${moongray};`;

export type SelectableProp = {
  selected: boolean;
};

export const selectable = ({ selected }: SelectableProp) =>
  selected && 'font-weight: 700;';

export type MaskableProp = {
  masked: boolean;
};

export const maskable = ({ masked }: MaskableProp) => masked && 'opacity: 50%;';
