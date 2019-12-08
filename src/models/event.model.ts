// MySql table: event_types
export interface EventModel {
  id: number;
  name: string;
  scope: string;
  trackingMilestoneId: number;
  trackingMilestoneName: string;
  trackingMilestonePlaceOrder: number;
  trackingMilestoneCssColor?: string;
}
