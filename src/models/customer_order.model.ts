// Models defined for Database Tables

// Table: customer_orders
export interface CustomerOrderModel {
  // Block: GENERAL
  id: number;
  companyId: number;
  customerId: number;
  orderNo: number;
  orderDate: string;
  observations?: string;
  custRef?: string;
  orderType: string;
  orderStatus: string;
  cancelDate?: string;
  cancelUser?: string;
  applicantName?: string;
  oldOrderNo?: string;
  incoterm?: string;
  shipmentMethod?: string;
  eta?: string;
  deliveryDate?: string;
  thirdPartyId: number;
  eventsScope?: string | 'G';
  pieces: number | 0;
  // Block: FROM
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
  // Block: TO
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
}
