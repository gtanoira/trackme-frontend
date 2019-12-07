export interface OrderEventModel {
  id: number;
  eventId: number;
  eventName?: string | 'Name not defined';
  userId: number;
  userName?: string;
  orderId: number;
  createdAt: string;
  observations: string;
  scope: string;
}
