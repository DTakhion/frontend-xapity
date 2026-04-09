import axios, { AxiosInstance } from 'axios';

/**
 *
 * @description Singleton to handle all the API requests
 */
export class RestApiService {
  public http: AxiosInstance;
  private static _instance: RestApiService;

  private constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL_DEV,
      timeout: 1_000 * 15, // 15 seconds
    });
  }

  public static getInstance(): RestApiService {
    if (!RestApiService._instance) {
      RestApiService._instance = new RestApiService();
    }
    return RestApiService._instance;
  }

  public setBackendToken(accessToken: string) {
    this.http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
}
