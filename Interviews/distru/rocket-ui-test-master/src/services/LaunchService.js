import axios from 'axios';

const SERVICES_URL = 'https://api.spacexdata.com/v3';
const serviceUrl = `${SERVICES_URL}/launches`;

const api = axios.create();

const launchService = {
  get: () => api.get(`${serviceUrl}`)
};

export default launchService;
