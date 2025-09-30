export interface Region {
  id: number;
  regionName: string;
}

export interface RegionRecord {
  id: string;
  external_id: number | null;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface District {
  id: number;
  districtName: string;
  regionID: number;
}

export interface DistrictRecord {
  id: string;
  external_id: number | null;
  name: string;
  region_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  region?: RegionRecord;
}

export interface Partner {
  id: number;
  partnerName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  regionID: number;
  districtID: number;
  locality: string;
}

export interface Intervention {
  id: number;
  name: string;
  description: string;
  implementingPartnerID: number;
  implementingPartner?: Partner;
}

export interface CicCentre {
  id: number;
  name: string;
  regionID: number;
  districtID: number;
  locality: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
}

export interface CicRecord {
  id: string;
  name: string;
  region_id: string |
    null;
  district_id: string |
    null;
  locality: string |
    null;
  contact_person: string |
    null;
  phone_number: string |
    null;
  email: string |
    null;
  status: string |
    null;
  created_at: string;
  updated_at: string;
  deleted_at?: string |
    null;
  region?: RegionRecord |
    null;
  district?: DistrictRecord |
    null;
}

export interface CreateCicPayload {
  name: string;
  region_id?: string |
    null;
  district_id?: string |
    null;
  locality?: string |
    null;
  contact_person?: string |
    null;
  phone_number?: string |
    null;
  email?: string |
    null;
  status?: string |
    null;
}

export interface UpdateCicPayload extends CreateCicPayload {}

export interface CicResponse {
  success: boolean;
  message?: string;
  data: CicRecord;
}

export interface CicsListResponse {
  success: boolean;
  message?: string;
  data: CicRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
  };
}

export interface ImplementingPartnerRecord {
  id: string;
  external_id: number | null;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  region_id: string;
  district_id: string;
  locality: string | null;
  region?: RegionRecord;
  district?: DistrictRecord;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InterventionRecord {
  id: string;
  external_id: number | null;
  name: string;
  description: string | null;
  implementing_partner_id: string;
  implementing_partner?: ImplementingPartnerRecord;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RegionResponse {
  success: boolean;
  message?: string;
  data: RegionRecord;
}

export interface RegionsListResponse {
  success: boolean;
  message?: string;
  data: RegionRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
  };
}

export interface DistrictResponse {
  success: boolean;
  message?: string;
  data: DistrictRecord;
}

export interface DistrictsListResponse {
  success: boolean;
  message?: string;
  data: DistrictRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
  };
}

export interface CreateRegionPayload {
  name: string;
  external_id?: number;
}

export interface UpdateRegionPayload {
  name?: string;
  external_id?: number | null;
}

export interface CreateDistrictPayload {
  name: string;
  region_id: string;
  external_id?: number;
}

export interface UpdateDistrictPayload {
  name?: string;
  region_id?: string;
  external_id?: number | null;
}

export interface ImplementingPartnerResponse {
  success: boolean;
  message?: string;
  data: ImplementingPartnerRecord;
}

export interface ImplementingPartnersListResponse {
  success: boolean;
  message?: string;
  data: ImplementingPartnerRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
  };
}

export interface InterventionResponse {
  success: boolean;
  message?: string;
  data: InterventionRecord;
}

export interface InterventionsListResponse {
  success: boolean;
  message?: string;
  data: InterventionRecord[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
  };
}

export interface CreateImplementingPartnerPayload {
  name: string;
  region_id: string;
  district_id: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  locality?: string | null;
  external_id?: number;
}

export interface UpdateImplementingPartnerPayload {
  name?: string;
  region_id?: string;
  district_id?: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  locality?: string | null;
  external_id?: number | null;
}

export interface CreateInterventionPayload {
  name: string;
  implementing_partner_id: string;
  description?: string | null;
  external_id?: number;
}

export interface UpdateInterventionPayload {
  name?: string;
  implementing_partner_id?: string;
  description?: string | null;
  external_id?: number | null;
}
