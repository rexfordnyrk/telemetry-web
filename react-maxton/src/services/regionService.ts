import { API_CONFIG } from "../config/api";
import { ApiService } from "./apiService";
import type {
  CreateRegionPayload,
  RegionRecord,
  RegionResponse,
  RegionsListResponse,
  UpdateRegionPayload,
} from "../types/settings";

type ListParams = {
  page?: number;
  limit?: number;
};

const buildListEndpoint = (params?: ListParams) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.REGIONS.LIST;
  if (!params || (params.page === undefined && params.limit === undefined)) {
    return baseEndpoint;
  }
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
};

export const regionService = {
  async list(params?: ListParams): Promise<RegionsListResponse> {
    return ApiService.get<RegionsListResponse>(buildListEndpoint(params));
  },

  async getById(id: string): Promise<RegionResponse> {
    return ApiService.get<RegionResponse>(API_CONFIG.ENDPOINTS.REGIONS.DETAIL(id));
  },

  async create(payload: CreateRegionPayload): Promise<RegionResponse> {
    return ApiService.post<RegionResponse>(API_CONFIG.ENDPOINTS.REGIONS.CREATE, payload);
  },

  async update(id: string, payload: UpdateRegionPayload): Promise<RegionResponse> {
    return ApiService.put<RegionResponse>(API_CONFIG.ENDPOINTS.REGIONS.UPDATE(id), payload);
  },

  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    return ApiService.delete(API_CONFIG.ENDPOINTS.REGIONS.DELETE(id));
  },
};

export type { RegionRecord };
