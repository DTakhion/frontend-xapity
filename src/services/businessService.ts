import { AxiosInstance } from 'axios';
import { CreateBusinessDto, IGetBusinessEntity, UpdateBusinessDto } from '../models/Business';
import { RestApiService } from './restApiService';
import { IPagination, Pagination } from '../models/Pagination';

class BusinessService {

  private restApiService: AxiosInstance;

  constructor() {
    this.restApiService = RestApiService.getInstance().http;
  }

  async getBusinessWithPagination(queryParams: Pick<Pagination, 'page' | 'take' | 'search'>) {
    const { page, take, search } = queryParams;
    return this.restApiService.get<IPagination<IGetBusinessEntity>>('/businesses', { params: { page, take, search: search ? search : undefined } });
  }

  async getById(id?: number) {
    return this.restApiService.get<IGetBusinessEntity>(`/businesses/${id}`);
  }

  async create(data: CreateBusinessDto) {
    return this.restApiService.post<IGetBusinessEntity>('/businesses', data);
  }

  public async updateBusiness(id: number, payload: UpdateBusinessDto) {
    return this.restApiService.patch<void>(`/businesses/${id}`, payload);
  }

  public async deleteBusiness(id?: number) {
    return this.restApiService.delete<IGetBusinessEntity>(`/businesses/${id}`);
  }
}

export default new BusinessService();
