import axios, { AxiosRequestConfig } from 'axios';
import { PrimaryKey } from '.';

export function fetchActor(payload: PrimaryKey, config?: AxiosRequestConfig) {
  return axios.get('http://advanse.lirmm.fr/siprojuris/api/actor/' + payload);
}
