import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action_buttons.component.html',
  styleUrls: ['./action_buttons.component.scss']
})

export class ActionButtonsComponent implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  public deleteItem($event) {
    console.log('*** deleteItem:', $event, this.params);
    if (this.params.onClick instanceof Function) {
      console.log('*** despues:', $event);
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      };
      this.params.onClick(params);
    }
  }

  public attachFile($event) {
    console.log('*** attachFile:', $event, this.params);
  }
}
