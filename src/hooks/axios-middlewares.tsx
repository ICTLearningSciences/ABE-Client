import { AxiosInstance } from 'axios';
import { localStorageStore } from '../store/local-storage';

/**
 * Middleware function takes some action on an axios instance
 */
export interface AxiosMiddleware {
  (axiosInstance: AxiosInstance): void;
}

export const extractAndStoreAccessToken: AxiosMiddleware = (
  axiosInstance: AxiosInstance
) => {
  axiosInstance.interceptors.response.use(
    function (response) {
      if (response?.data?.extensions?.newToken?.accessToken) {
        localStorageStore(
          'accessToken',
          response.data.extensions.newToken.accessToken
        );
      }
      return response;
    },
    function (error) {
      return error;
    }
  );
};
