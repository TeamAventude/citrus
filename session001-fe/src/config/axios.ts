import axios from 'axios';
import { accessTokenWithType } from 'store/auth/selector';
import { apiURL } from './urls';

export const axiosInstance = axios.create({
  baseURL: apiURL,

  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

export function createAxios({ getState }: { getState: any }) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const { useAuth, ...headers } = config.headers;

      const state = getState();
      headers.Authorization = accessTokenWithType(state);

      return { ...config, headers };
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
