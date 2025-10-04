import { API_CONFIG } from "../config/api";
import { ApiService } from "./apiService";
import type {
  CreateInterventionPayload,
  InterventionsListResponse,
  InterventionResponse,
  UpdateInterventionPayload,
} from "../types/settings";

type ListParams = {
  page?: number;
  limit?: number;
  implementing_partner_id?: string;
};

const buildListEndpoint = (params?: ListParams) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.INTERVENTIONS.LIST;
  if (!params || (params.page === undefined && params.limit === undefined && !params.implementing_partner_id)) {
    return baseEndpoint;
  }

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.implementing_partner_id) searchParams.set("implementing_partner_id", params.implementing_partner_id);

  const query = searchParams.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
};

export const interventionService = {
  async list(params?: ListParams): Promise<InterventionsListResponse> {
    return ApiService.get<InterventionsListResponse>(buildListEndpoint(params));
  },

  async getById(id: string): Promise<InterventionResponse> {
    return ApiService.get<InterventionResponse>(API_CONFIG.ENDPOINTS.INTERVENTIONS.DETAIL(id));
  },

  async create(payload: CreateInterventionPayload): Promise<InterventionResponse> {
    return ApiService.post<InterventionResponse>(API_CONFIG.ENDPOINTS.INTERVENTIONS.CREATE, payload);
  },

  async update(id: string, payload: UpdateInterventionPayload): Promise<InterventionResponse> {
    return ApiService.put<InterventionResponse>(API_CONFIG.ENDPOINTS.INTERVENTIONS.UPDATE(id), payload);
  },

  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    return ApiService.delete(API_CONFIG.ENDPOINTS.INTERVENTIONS.DELETE(id));
  },
};
