export interface WarehouseModel {
  id: number;
  alias: string;
  name: string;
  companyId: number;
  companyName?: string | '';
}
