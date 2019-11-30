export interface OrderModel {
  // GENERAL block
  id: number;
  companyId: number;
  companyName?: string | '';
  clientId: number;
  clientName?: string | '';
  orderNo: number;
  type: string;
  applicantName: string;
  cancelDatetime: string;
  cancelUser: string;
  clientRef: string;
  deliveryDatetime: string;
  eta: string;
  incoterm: string;
  legacyOrderNo: string;
  observations: string;
  orderDatetime: string;
  orderStatus: string;
  orderType: string;
  pieces: number;
  shipmentMethod: string;
  thirdPartyId: string;
  // SHIPPER block
  fromEntity: string;
  fromAddress1: string;
  fromAddress2: string;
  fromCity: string;
  fromZipcode: string;
  fromState: string;
  fromCountryId: string;
  fromContact: string;
  fromEmail: string;
  fromTel: string;
  // CONSIGNEE block
  toEntity: string;
  toAddress1: string;
  toAddress2: string;
  toCity: string;
  toZipcode: string;
  toState: string;
  toCountryId: ['ARG'],
  toContact: string;
  toEmail: string;
  toTel: string;
  // CARRIER block
  // GROUND
  groundEntity: string;
  groundBookingNo: string;
  groundDepartureCity: string;
  groundDepartureDate: string;
  groundArrivalCity: string;
  groundArrivalDate: string;
  // AIR
  airEntity: string;
  airWaybillNo: string;
  airDepartureCity: string;
  airDepartureDate: string;
  airArrivalCity: string;
  airArrivalDate: string;
  // SEA
  seaEntity: string;
  seaBillLandingNo: string;
  seaBookingNo: string;
  seaContainersNo: string;
  seaWaybillNo: string;
  seaDepartureCity: string;
  seaDepartureDate: string;
  seaArrivalCity: string;
  seaArrivalDate: string;
}
