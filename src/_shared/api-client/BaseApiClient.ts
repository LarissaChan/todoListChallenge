import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios';
import type { IBaseApiClient } from './IBaseApiClient';

export class BaseApiClient implements IBaseApiClient {
  protected axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://localhost:7042",
    });

    // Adiciona interceptor de resposta
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const msg = this.handleError(error);
        error.message = msg;
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return `(${error.response.status}) Os dados da requisição estão inválidos.`;
        case 401:
          return `(${error.response.status}) Você não está autorizado a realizar esta requisição.`;
        case 404:
          return `(${error.response.status}) Recurso não encontrado.`;
        default:
          return `(${error.response.status}) Ocorreu um erro na requisição.`;
      }
    } else if (error.request) {
      return `(${error.code}) O servidor não respondeu.`;
    } else {
      return 'Ocorreu um erro desconhecido na requisição.';
    }
  }

  // métodos
  public async get<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(url);
    return response.data;
  }

  public async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, data);
    return response.data;
  }
}

    
        
    
        