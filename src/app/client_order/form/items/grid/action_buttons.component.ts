import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';

// Dialog Modal Component
import { DialogModalComponent } from 'src/shared/dialog/dialog.component';

// Services
import { ItemService } from 'src/shared/item.service';
import { ErrorMessageService } from 'src/shared/error-message.service';
import { OrderService } from 'src/shared/order.service';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action_buttons.component.html',
  styleUrls: ['./action_buttons.component.scss']
})

export class ActionButtonsComponent implements ICellRendererAngularComp {

  constructor(
    public  dialog: MatDialog,
    private errorMessageService: ErrorMessageService,
    private itemService: ItemService,
    private orderService: OrderService
  ) {}
  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  // Delete an Item of the order
  public deleteItem($event) {
    // Open a Dialog Modal
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '320px',
      data: {
        title: 'Delete item',
        dialogType: 'Alert',
        body: this.params.node.data.itemId,
        btn1Text: 'Cancel',
        btn2Text: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(
     btnClick => {
        if (btnClick === 2) {
          this.itemService.deleteItem(this.params.data['id']).subscribe(
            data => {
              this.errorMessageService.changeErrorMessage(data.message);
              // Get all screens refresh with the new data
              this.orderService.newDBaseItem.next(true);
            },
            err => this.errorMessageService.changeErrorMessage(err)
          );
        }
      }
    );
  }

  public attachFile($event) {
    console.log('*** attachFile:', $event, this.params);
  }

  // Dialog Modal
  openDialogModal(): void {

  }
}
