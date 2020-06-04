import React, { useState, useEffect } from 'react';
import rawNodes from '../../data/actor-nodes';
import _ from 'lodash';
import fuzzysort from 'fuzzysort';
import { useSelector } from 'react-redux';
import { selectActors } from '../../selectors/event';
import styled from 'styled-components/macro';
import { AutocompleteItem } from './AutocompleteItem';
import { stopEventPropagation } from '../../hooks/useClick';

const actorLabels: Fuzzysort.Prepared[] = _.map(rawNodes, (n) => ({
  id: n.id,
  ...fuzzysort.prepare(
    n.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  )!,
}));

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
`;

const Container = styled.div`
  position: relative;
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
  const activeActors = useSelector(selectActors);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function clear() {
    setText('');
  }

  useEffect(() => {
    setResults(
      _.filter(
        fuzzysort.go(text, actorLabels, options),
        (r) => activeActors[(r as any).id] === undefined
      )
    );
  }, [text, activeActors]);

  return (
    <Container onMouseUpCapture={stopEventPropagation}>
      <input
        type="text"
        name="fuzzy-search"
        id="fuzzy-search"
        value={text}
        onChange={handleChange}
        placeholder="Rechercher un acteur"
      />
      {results.length > 0 && (
        <AutocompleteItems>
          {_.map(results, (r: any) => (
            <Item key={r.id} r={r} onClick={clear} />
          ))}
        </AutocompleteItems>
      )}
    </Container>
  );
};

export default Autocomplete;
