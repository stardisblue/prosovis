import React, { FormEvent, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { stopEventPropagation } from '../../../hooks/useClick';
import { addCustomFilterThunk } from '../../thunks/customFilterThunk';

export const CustomFiltersInput: React.FC = function () {
  const dispatch = useDispatch();

  const [input, setInput] = useState('');

  const handleInput = useCallback((e: FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input) dispatch(addCustomFilterThunk(input));
      setInput('');
    },
    [input, dispatch]
  );

  return (
    <form onSubmit={handleSubmit} onMouseUpCapture={stopEventPropagation}>
      <input
        type="text"
        name="add-filter"
        id="add-filter"
        placeholder="add filter"
        aria-label="add filter"
        value={input}
        onInput={handleInput}
      />
      <button type="submit" disabled={input.trim() === ''}>
        ✔
      </button>
    </form>
  );
};
