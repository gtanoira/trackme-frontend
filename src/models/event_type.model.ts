// MySql table: event_types
export interface EventTypeModel {
  id: string;
  name: string;
  trackingMilestoneId?: number;
  trackingMilestoneCssColor?: string;
}
