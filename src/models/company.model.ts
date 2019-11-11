// Table: Entities
export interface CompanyModel {
  id: string;
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  countryId: string;
  countryName?: string;
}
