import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


// External libraries
import * as moment from 'moment';

// Models
import { ItemModel } from 'src/models/item.model';

// Services
import { OrderService } from 'src/shared/order.service';
import { AgGridLoadingComponent } from 'src/shared/ag-grid_loading.component';
import { CustomTooltipComponent } from 'src/shared/custom-tooltip.component';

// Components
import { ActionButtonsComponent } from './action_buttons.component';

@Component({
  selector: 'app-order-item-grid',
  templateUrl: './order_item_grid.component.html',
  styleUrls: ['./order_item_grid.component.scss']
})
export class OrderItemGridComponent implements OnInit, OnDestroy {

  // Define input parameters
  @Input() orderId: number;

  // ag-grid setup variables
  public  columnDefs;
  public  defaultColDef;
  public  frameworkComponents;
  private gridApi;
  private gridColumnApi;
  public  loadingOverlayComponent;
  public  loadingOverlayComponentParams;
  public  overlayLoadingTemplate;
  public  rowData: ItemModel[] = [];

  // Define subscriptions
  subsNewOrderItem: Subscription;

  constructor(
    private orderService: OrderService,
  ) {
    // Define columns of the ag-grid
    this.columnDefs = [
      {
        headerName: 'Actions',
        cellRenderer: 'buttonRenderer',
        width: 80
      }, {
        headerName: 'Warehouse',
        field: 'warehouseName',
        width: 140
      }, {
        headerName: 'Type',
        field: 'itemType',
        width: 90
      }, {
        headerName: 'Condition',
        field: 'conditionName',
        width: 90
      }, {
        headerName: 'Item Id',
        field: 'itemId',
        width: 150
      }, {
        headerName: 'Status',
        field: 'statusName',
        width: 110
      }, {
        headerName: 'Quantity',
        field: 'quantity',
        width: 80
      }, {
        headerName: 'Part No.',
        field: 'partNumber',
        width: 150
      }, {
        headerName: 'Serial No.',
        field: 'serialNumber',
        width: 150
      }, {
        headerName: 'UA No.',
        field: 'uaNumber',
        width: 150
      }, {
        headerName: 'Model',
        field: 'model',
        width: 130
      }, {
        headerName: 'Description',
        field: 'description',
        width: 130
      }
    ];
    this.defaultColDef = {
      sortable: true,
      tooltipComponent: 'customTooltip',
      resizable: true
    };
    this.frameworkComponents = {
      customLoadingOverlay: AgGridLoadingComponent,
      customTooltip: CustomTooltipComponent,
      buttonRenderer: ActionButtonsComponent
    };
    this.loadingOverlayComponent = 'customLoadingOverlay';
    this.loadingOverlayComponentParams = { loadingMessage: 'Loading ...' };

    // Render the table grid if someone add a new event to an order
    this.subsNewOrderItem = this.orderService.newDBaseItem.subscribe(
      data => this.setTableGrid()
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subsNewOrderItem.unsubscribe();
  }

  // Adjust the columns size of the grid
  autoSizeAllColumns() {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  // This routine is executed when the ag-grid is ready
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Setup the table grid
    this.setTableGrid();
  }

  // Set the table grid
  private setTableGrid() {
    // Show spinner
    this.gridApi.showLoadingOverlay();

    // Get all orders data
    this.orderService.getAllOrderItems(this.orderId).subscribe(
      data => {
        this.gridApi.setRowData(data);
      }
    );
  }

}
