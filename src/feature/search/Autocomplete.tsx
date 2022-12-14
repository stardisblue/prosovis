import React, { useState, useEffect } from 'react';

import fuzzysort from 'fuzzysort';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { AutocompleteItem } from './AutocompleteItem';
import { stopEventPropagation } from '../../hooks/useClick';
import { createSelector } from 'reselect';
import { selectDetailActors } from '../../v2/selectors/detail/actors';
import { selectActors } from '../../v2/selectors/actors';
import { filter, map } from 'lodash/fp';

const selectActorLabels = createSelector(selectActors, (actors) =>
  map(
    (n) => ({
      id: n.id,
      ...fuzzysort.prepare(
        n.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )!,
    }),
    actors
  )
);

const options = { limit: 20, threshold: -10000 };

const AutocompleteItems = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid black;
  list-style-type: none;
  padding: 0.25em;
  border-radius: 3px;
  margin: 0;
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
  background-color: #f1f1f1;
  width: 100%;
  line-height: 1.5;
`;

const Item = styled(AutocompleteItem)`
  border-bottom: 1px solid lightgray;
  cursor: pointer;
  padding: 0.25em 1em;
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: lightgray;
  }
`;

const Autocomplete: React.FC = function () {
  const [text, setText] = useState('');
  const [results, setResults] = useState<Fuzzysort.Result[]>([]);
  const activeActors = useSelector(selectDetailActors);
  const actorLabels = useSelector(selectActorLabels);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function clear() {
    setText('');
  }

  useEffect(() => {
    setResults(
      filter(
        (r) => activeActors[(r as any).id] === undefined,
        fuzzysort.go(text, actorLabels, options)
      )
    );
  }, [text, activeActors, actorLabels]);

  return (
    <Container onMouseUpCapture={stopEventPropagation}>
      <StyledInput
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Actor search"
      />
      {results.length > 0 && (
        <AutocompleteItems>
          {results.map((r) => (
            <Item key={(r as any).id} r={r} onClick={clear} />
          ))}
        </AutocompleteItems>
      )}
    </Container>
  );
};

export default Autocomplete;
