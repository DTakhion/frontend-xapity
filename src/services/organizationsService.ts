import { AxiosInstance } from 'axios';
import { ICreateOrganizationEntity } from '../models/Organization';
import { RestApiService } from './restApiService';

class OrganizationsService {
  private restApiService: AxiosInstance;

  constructor() {
    this.restApiService = RestApiService.getInstance().http;
  }

  async getAll() {
    return this.restApiService.get('/organizations');
  }

  async getById(id: string | number) {
    return this.restApiService.get(`/organizations/${id}`);
  }

  async create(data: ICreateOrganizationEntity) {
    return this.restApiService.post<{ token: string }>('/organizations', data);
  }
}

export default new OrganizationsService();
