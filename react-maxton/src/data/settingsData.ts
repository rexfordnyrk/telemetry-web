import { CicCentre, District, Intervention, Partner, Region } from "../types/settings";

export const initialRegions: Region[] = [
  { id: 1, regionName: "AHAFO" },
  { id: 2, regionName: "ASHANTI" },
  { id: 3, regionName: "BONO EAST" },
  { id: 7, regionName: "GREATER ACCRA" },
  { id: 10, regionName: "UPPER EAST" },
];

export const initialDistricts: District[] = [
  { id: 33, districtName: "BEKWAI MUNICIPAL", regionID: 2 },
  { id: 72, districtName: "EJISU MUNICIPAL", regionID: 2 },
  { id: 105, districtName: "KUMASI METROPOLITAN", regionID: 2 },
  { id: 128, districtName: "ADENTA MUNICIPAL", regionID: 7 },
  { id: 139, districtName: "KORLE KLOTTEY MUNICIPAL", regionID: 7 },
  { id: 212, districtName: "BOLGATANGA MUNICIPAL", regionID: 10 },
];

export const initialPartners: Partner[] = [
  {
    id: 10,
    partnerName: "GI-KACE CONSULT",
    contactPerson: "PRISCILLA HOPE",
    phoneNumber: "0248705509",
    email: "priscilla.hope@example.com",
    regionID: 7,
    districtID: 139,
    locality: "OSU",
  },
  {
    id: 18,
    partnerName: "BOLGATANGA DIGITAL HUB",
    contactPerson: "EDWARD AKAMBA",
    phoneNumber: "0244011122",
    email: "edward.akamba@example.com",
    regionID: 10,
    districtID: 212,
    locality: "BOLGATANGA CENTRAL",
  },
];

const emiDescription = `At the foundation of the DARE program is the initiative to facilitate improved market access for rural communities using digital technologies to help bridge the digital gap. This intervention aims to augment the capabilities of the Community Information Centers (CICs), which will be utilized to facilitate digital inclusion for young women, particularly young mothers who are predominantly engaged in petty trading.
The Enterprise Market Information (EMI) system, a digital marketplace, will serve as a conduit connecting rural communities to broader markets, thereby surmounting the challenges posed by geographic isolation. This foundational intervention not only opens new economic opportunities but also sets the stage for further empowerment through digital literacy, online commerce skills and generally facilitating access to information.`;

export const initialInterventions: Intervention[] = [
  {
    id: 7,
    name: "Enhanced Connectivity and Market Access",
    description: emiDescription,
    implementingPartnerID: 10,
  },
  {
    id: 11,
    name: "Digital Skills Acceleration",
    description:
      "Hands-on digital literacy training program designed for youth and women to rapidly build foundational and intermediate competencies for online commerce and remote work.",
    implementingPartnerID: 18,
  },
];

export const initialCics: CicCentre[] = [
  {
    id: 4,
    name: "Bekwai CIC",
    regionID: 2,
    districtID: 33,
    locality: "Bekwai Township",
    contactPerson: "MIRIAM ARHIN",
    phoneNumber: "0245557788",
    email: "miriam.arhin@example.com",
  },
  {
    id: 9,
    name: "Bolgatanga CIC",
    regionID: 10,
    districtID: 212,
    locality: "Bolgatanga Central",
    contactPerson: "JOSEPH ATANGA",
    phoneNumber: "0209988776",
    email: "joseph.atanga@example.com",
  },
];
