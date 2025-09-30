import { API_CONFIG } from "../config/api";
import { ApiService } from "./apiService";
import type {
  CreateDistrictPayload,
  DistrictResponse,
  DistrictsListResponse,
  UpdateDistrictPayload,
} from "../types/settings";

type ListParams = {
  page?: number;
  limit?: number;
  region_id?: string;
};

const buildListEndpoint = (params?: ListParams) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.DISTRICTS.LIST;
  if (!params || (params.page === undefined && params.limit === undefined && !params.region_id)) {
    return baseEndpoint;
  }

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.region_id) {
    searchParams.set("region_id", params.region_id);
  }

  const query = searchParams.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
};

export const districtService = {
  async list(params?: ListParams): Promise<DistrictsListResponse> {
    return ApiService.get<DistrictsListResponse>(buildListEndpoint(params));
  },

  async getById(id: string): Promise<DistrictResponse> {
    return ApiService.get<DistrictResponse>(API_CONFIG.ENDPOINTS.DISTRICTS.DETAIL(id));
  },

  async create(payload: CreateDistrictPayload): Promise<DistrictResponse> {
    return ApiService.post<DistrictResponse>(API_CONFIG.ENDPOINTS.DISTRICTS.CREATE, payload);
  },

  async update(id: string, payload: UpdateDistrictPayload): Promise<DistrictResponse> {
    return ApiService.put<DistrictResponse>(API_CONFIG.ENDPOINTS.DISTRICTS.UPDATE(id), payload);
  },

  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    return ApiService.delete(API_CONFIG.ENDPOINTS.DISTRICTS.DELETE(id));
  },
};
