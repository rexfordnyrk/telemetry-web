export interface Region {
  id: number;
  regionName: string;
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
