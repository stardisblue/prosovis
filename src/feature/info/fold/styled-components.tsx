import { moongray } from '../../../v2/components/theme';

export type HighlightableProp = {
  highlighted: boolean;
};

export const highlightable = ({ highlighted }: HighlightableProp) =>
  highlighted && `background-color: ${moongray}; border-radius: 2px;`;

export type SelectableProp = {
  selected: boolean;
};

export const selectable = ({ selected }: SelectableProp) =>
  'cursor: pointer;' + (selected ? 'font-weight: 700;' : '');

export type MaskableProp = {
  masked: boolean;
};

export const maskable = ({ masked }: MaskableProp) => masked && 'opacity: 50%;';
