import { Component, OnInit, Input, OnDestroy } from '@angular/core';

// External libraries
import * as moment from 'moment';

// Models
import { OrderGridModel } from '../../../../../models/order_grid.model';

// Services
import { OrderService } from '../../../../../shared/order.service';
import { AgGridLoadingComponent } from '../../../../../shared/ag-grid_loading.component';
import { CustomTooltipComponent } from '../../../../../shared/custom-tooltip.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-event-grid',
  templateUrl: './order_event_grid.component.html',
  styleUrls: ['./order_event_grid.component.scss']
})
export class OrderEventGridComponent implements OnInit, OnDestroy {

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
  public  rowData: OrderGridModel[] = [];

  // Define subscriptions
  subsNewOrderEvent: Subscription;

  constructor(
    private orderService: OrderService,
  ) {
    // Define columns of the ag-grid
    this.columnDefs = [
      {
        headerName: 'Event',
        field: 'eventName',
        width: 210
      }, {
        headerName: 'Milestone',
        field: 'trackingMilestoneName',
        width: 170
      }, {
        headerName: 'Scope',
        field: 'scope',
        width: 70
      }, {
        headerName: 'Observations',
        field: 'observations',
        width: 300
      }, {
        headerName: 'Created By',
        field: 'userName',
        width: 150
      }, {
        headerName: 'Created At',
        field: 'createdAt',
        valueFormatter: function(params) {
          return moment(params.data.createdAt).format('YYYY-MM-DD HH:MM:ss');
        },
        sort: 'desc',
        sortingOrder: ['asc', 'desc'],
        width: 143
      }
    ];
    this.defaultColDef = {
      sortable: true,
      tooltipComponent: 'customTooltip',
      resizable: true
    };
    this.frameworkComponents = {
      customLoadingOverlay: AgGridLoadingComponent,
      customTooltip: CustomTooltipComponent
    };
    this.loadingOverlayComponent = 'customLoadingOverlay';
    this.loadingOverlayComponentParams = { loadingMessage: 'Loading ...' };

    // Render the table grid if someone add a new event to an order
    this.subsNewOrderEvent = this.orderService.newDBaseEvent.subscribe(
      data => this.setTableGrid()
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subsNewOrderEvent.unsubscribe();
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
    this.orderService.getAllOrderEvents(this.orderId).subscribe(
      data => this.gridApi.setRowData(data)
    );
  }

}
