// Models defined for Database Tables

// Table: customer_orders
export interface ItemsModel {
  id: number;
  customerId: number;
  companyId: number;
  itemId: string;
  itemType: number;
  status: number;
  deletedBy: string;
  deletedCause: string;
  manufacter: string;
  model: string;
  partNumber: string;
  serialNumber: string;
  condition: number;
  contents: string;
  unitLength: number;
  width: number;
  height: number;
  length: number;
  unitWeight: number;
  weight: number;
  unitVolume: number;
  volumeWeight: number;
  internalorderId: number;
}
