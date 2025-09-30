import { ApiService } from "./apiService";
import { API_CONFIG } from "../config/api";
import type {
  CicResponse,
  CicsListResponse,
  CreateCicPayload,
  UpdateCicPayload,
} from "../types/settings";

export interface CicListParams {
  page?: number;
  limit?: number;
  region_id?: string;
  district_id?: string;
  status?: string;
}

const buildListEndpoint = (params?: CicListParams) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.CICS.LIST;
  if (!params) {
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
  if (params.district_id) {
    searchParams.set("district_id", params.district_id);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
};

export const cicService = {
  async list(params?: CicListParams): Promise<CicsListResponse> {
    return ApiService.get<CicsListResponse>(buildListEndpoint(params));
  },

  async getById(id: string): Promise<CicResponse> {
    return ApiService.get<CicResponse>(API_CONFIG.ENDPOINTS.CICS.DETAIL(id));
  },

  async create(payload: CreateCicPayload): Promise<CicResponse> {
    return ApiService.post<CicResponse>(API_CONFIG.ENDPOINTS.CICS.CREATE, payload);
  },

  async update(id: string, payload: UpdateCicPayload): Promise<CicResponse> {
    return ApiService.put<CicResponse>(API_CONFIG.ENDPOINTS.CICS.UPDATE(id), payload);
  },

  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    return ApiService.delete(API_CONFIG.ENDPOINTS.CICS.DELETE(id));
  },
};
