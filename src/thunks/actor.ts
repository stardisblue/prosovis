import { addActor } from '../reducers/eventSlice';
import axios from 'axios';
import { PrimaryKey } from '../data';
export const addActorThunk = function (payload: PrimaryKey) {
  return (dispatch: any) => {
    axios
      .get('http://advanse.lirmm.fr/siprojuris/api/actor/' + payload)
      .then((response) => {
        // console.log(response);
        dispatch(addActor(response.data));
      });
  };
};
