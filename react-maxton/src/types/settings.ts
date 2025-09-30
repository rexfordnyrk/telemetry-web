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
