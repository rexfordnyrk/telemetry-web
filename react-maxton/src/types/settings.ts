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
