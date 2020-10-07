import axios, { AxiosRequestConfig } from 'axios';
import { PrimaryKey } from './models';

export function fetchActor(payload: PrimaryKey, config?: AxiosRequestConfig) {
  return axios.get('http://advanse.lirmm.fr/siprojuris/api/actor/' + payload, {
    timeout: 2000,
  });
}

export function pingServer() {
  return axios.get('http://advanse.lirmm.fr/dsiprojuris/api/', {
    timeout: 2000,
  });
}
