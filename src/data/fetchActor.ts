import axios, { AxiosRequestConfig } from 'axios';
import { PrimaryKey } from './models';

const axiosConfig = {
  timeout: 4000,
};

const baseurl =
  'https://prosovis-observable-cors.glitch.me/http://advanse.lirmm.fr/siprojuris/api/';

export function fetchActor(payload: PrimaryKey, config?: AxiosRequestConfig) {
  return axios.get(baseurl + 'actor/' + payload, axiosConfig);
}

export function pingServer() {
  return axios.get(baseurl, axiosConfig);
}
