import React from 'react';
import { useDispatch } from 'react-redux';
import { useFlatClick } from '../../hooks/useClick';
import fuzzysort from 'fuzzysort';
import { tryAddDetailActorThunk } from '../../v2/thunks/actors';

const highlight = (r: any, f: any, s = '\xA9') =>
  fuzzysort
    .highlight(r, s, s)!
    .split(s)
    .map((s, i) => (i % 2 ? f(s, i) : s));
export const AutocompleteItem: React.FC<any> = function ({
  r,
  className,
  onClick,
}) {
  const dispatch = useDispatch();
  const clicky = useFlatClick(() => {
    dispatch(tryAddDetailActorThunk(r.id));
    onClick();
  });
  return (
    <li className={className} id={'res-' + r.id} {...clicky}>
      {highlight(r, (match: any, i: number) => (
        <b key={`${match}_${i}`}>{match}</b>
      ))}
    </li>
  );
};

export default AutocompleteItem;
