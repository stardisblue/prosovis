import { darkgray, lightgray } from './ui/colors';

export const scrollbar = `
&::-webkit-scrollbar-corner {
  background-color: transparent;
  border-color: transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: ${darkgray};
}
&::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${lightgray};
}`;
