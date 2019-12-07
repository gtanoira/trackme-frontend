// MySql table: event_types
export interface EventModel {
  id: number;
  name: string;
  trackingMilestoneId: number;
  trackingMilestoneName: string;
  trackingMilestonePlaceOrder: number;
  trackingMilestoneCssColor?: string;
}
