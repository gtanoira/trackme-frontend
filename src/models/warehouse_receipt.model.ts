// Models defined for Database Tables

// Table: customer_orders
export interface WarehouseReceiptModel {
  id: number;
  orderNo: number;
  orderDate: string;
  observations?: string;
  orderType: string;
  orderStatus: string;
  shipmentMethod?: string | 'A';
  eta?: string;
  deliverDate?: string;
  pieces?: number | 0;
  companyId: number;
  companyName?: string;
  customerId: number;
  customerName?: string;
  customerOrderId?: number;
  cancelDate?: string;
  cancelUser?: string;
  // FROM
  fromEntity: string;
  fromAddress1?: string;
  fromAddress2?: string;
  fromCity?: string;
  fromZipcode?: string;
  fromState?: string;
  fromCountryId: string;
  fromContact?: string;
  fromEmail?: string;
  fromTel?: string;
  // TO
  toEntity: string;
  toAddress1?: string;
  toAddress2?: string;
  toCity?: string;
  toZipcode?: string;
  toState?: string;
  toCountryId: string;
  toContact?: string;
  toEmail?: string;
  toTel?: string;
  // GROUND
  groundEntity: string;
  groundBookingNo?: string;
  groundDepartureCity?: string;
  groundDepartureDate?: string;
  groundArrivalCity?: string;
  groundArrivalDate?: string;
  // AIR
  airEntity: string;
  airBookingNo?: string;
  airDepartureCity?: string;
  airDepartureDate?: string;
  airArrivalCity?: string;
  airArrivalDate?: string;
  // SEA
  seaEntity: string;
  seaBillLandingNo?: string;
  seaContainersNo?: string;
  seaBookingNo?: string;
  seaDepartureCity?: string;
  seaDepartureDate?: string;
  seaArrivalCity?: string;
  seaArrivalDate?: string;
}
