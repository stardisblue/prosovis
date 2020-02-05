import { createSlice } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent } from '../data';

export const eventSlice = createSlice({
  name: 'event',
  initialState: { events: {} as { [k in PrimaryKey]: AnyEvent } },
  reducers: {}
});
