// Table: Entities
export interface EntityModel {
  id: string;
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipcode?: string;
  state?: string;
  alias?: string;
  entityType: string;
  countryId: string;
  companyId: string;
}
