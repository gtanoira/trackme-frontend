export interface OrderGridModel {
  id: number;
  companyName: string;
  clientName: string;
  orderNo: number;
  type: string;
  clientRef?: string;
  orderDatetime: string;
  observations?: string;
  orderStatus: string;
  pieces: number | 0;
  fromEntity: string;
  toEntity: string;
}
