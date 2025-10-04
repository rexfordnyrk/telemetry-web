import { API_CONFIG } from "../config/api";
import { ApiService } from "./apiService";
import type {
  CreateImplementingPartnerPayload,
  ImplementingPartnerResponse,
  ImplementingPartnersListResponse,
  UpdateImplementingPartnerPayload,
} from "../types/settings";

type ListParams = {
  page?: number;
  limit?: number;
  region_id?: string;
  district_id?: string;
};

const buildListEndpoint = (params?: ListParams) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.IMPLEMENTING_PARTNERS.LIST;
  if (!params || (params.page === undefined && params.limit === undefined && !params.region_id && !params.district_id)) {
    return baseEndpoint;
  }

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.region_id) searchParams.set("region_id", params.region_id);
  if (params.district_id) searchParams.set("district_id", params.district_id);

  const query = searchParams.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
};

export const implementingPartnerService = {
  async list(params?: ListParams): Promise<ImplementingPartnersListResponse> {
    return ApiService.get<ImplementingPartnersListResponse>(buildListEndpoint(params));
  },

  async getById(id: string): Promise<ImplementingPartnerResponse> {
    return ApiService.get<ImplementingPartnerResponse>(API_CONFIG.ENDPOINTS.IMPLEMENTING_PARTNERS.DETAIL(id));
  },

  async create(payload: CreateImplementingPartnerPayload): Promise<ImplementingPartnerResponse> {
    return ApiService.post<ImplementingPartnerResponse>(API_CONFIG.ENDPOINTS.IMPLEMENTING_PARTNERS.CREATE, payload);
  },

  async update(id: string, payload: UpdateImplementingPartnerPayload): Promise<ImplementingPartnerResponse> {
    return ApiService.put<ImplementingPartnerResponse>(API_CONFIG.ENDPOINTS.IMPLEMENTING_PARTNERS.UPDATE(id), payload);
  },

  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    return ApiService.delete(API_CONFIG.ENDPOINTS.IMPLEMENTING_PARTNERS.DELETE(id));
  },
};
