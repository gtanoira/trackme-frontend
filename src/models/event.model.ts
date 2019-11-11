// Models defined for Database Tables

// Table: customer_orders
export interface EventModel {
  eventTypeId: number;
  eventTypeName?: string;
  userId: number;
  userName?: string;
  eventDatetime: string;
  eventScope: string | 'PUB';
  observations: string;
  customerOrderId: number;
}
