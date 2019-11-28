// Table: Entities
export interface ClientModel {
  id: string;
  name: string;
  alias?: string;
  countryId: string;
  countryName?: string | '';
  companyId: string;
  companyName?: string | '';
}
