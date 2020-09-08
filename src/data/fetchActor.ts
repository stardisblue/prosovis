import axios, { AxiosRequestConfig } from 'axios';
import { PrimaryKey } from './models';

export function fetchActor(payload: PrimaryKey, config?: AxiosRequestConfig) {
  return axios.get('http://advanse.lirmm.fr/siprojuris/api/actor/' + payload);
}
