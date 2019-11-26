import { Component, OnInit, AfterViewInit, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';

// import { LicenseManager } from 'ag-grid-enterprise';
// LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__24_November_2018__MTU0MzAxNzYwMDAwMA==a39c92782187aa78196ed1593ccd1527');

// Models
import { OrderGridModel } from '../../../models/order_grid.model';

// Services
import { OrderService } from '../../../shared/order.service';
import { CustomTooltipComponent } from '../../../shared/custom-tooltip.component';
import { AgGridLoadingComponent } from '../../../shared/ag-grid_loading.component';

/* ***********************************************************************
    DATE formatting settings
*/
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'll',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// *********************************************************************

@Component({
  selector: 'app-client-order-grid',
  templateUrl: './order_grid.component.html',
  styleUrls: ['./order_grid.component.scss']
})
export class OrderGridComponent implements OnInit {

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

  /*
  private onQuickFilterChanged() {
    this.gridOptions.api.setQuickFilter(this.quickSearchValue);
  }
  */

  constructor(
    private orderService: OrderService,
  ) {
    // Define columns of the ag-grid
    this.columnDefs = [
      {
        headerName: 'Company',
        field: 'companyName',
        filter: 'agTextColumnFilter',
        width: 100
      }, {
        headerName: 'Type',
        headerTooltip: 'Order\'s type',
        valueGetter: function(params) {
           return (params.data.type === 'WarehouseReceipt') ? 'IN->WR' : 'OUT<-SH';
        },
        width: 88
      }, {
        headerName: 'Order No.',
        field: 'orderNo',
        filter: 'agTextColumnFilter',
        width: 100,
        cellStyle: { 'text-align': 'center' }
      }, {
        field: 'id',
        hide: true
      }, {
        headerName: 'Client',
        field: 'clientName',
        filter: 'agTextColumnFilter',
        width: 210
      }, {
        headerName: 'Client PO',
        headerTooltip: 'Client\'s Purchase Order',
        field: 'clientRef',
        filter: 'agTextColumnFilter',
        width: 160
      }, {
        headerName: 'Date',
        field: 'orderDatetime',
        valueFormatter: function(params) {
          return moment(params.data.orderDatetime).format('YYYY-MM-DD HH:MM:ss');
        },
        sort: 'desc',
        sortingOrder: ['asc', 'desc'],
        width: 165
      }, {
        headerName: 'Shipper',
        field: 'fromEntity',
        width: 210
      }, {
        headerName: 'Consignee',
        field: 'toEntity',
        width: 210
      }, {
        headerName: 'Status',
        width: 100,
        valueGetter: function(params) {
          switch(params.data.orderStatus) {
            case 'P': return 'Pending'; break;
            case 'C': return 'Confirmed'; break;
            case 'F': return 'Finalized'; break;
            case 'A': return 'Cancelled'; break;
          }
        },
        filter: 'agTextColumnFilter',
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

  }

  ngOnInit() {
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

    // >Show s pinner
    this.gridApi.showLoadingOverlay();

    // Get all orders data
    this.orderService.getOrdersGrid()
      .subscribe(
        data => this.gridApi.setRowData(data)
      );
  }

  // Edit an order (WR or SH) and put it in a new tab
  onRowDoubleClicked(rowData) {
    console.log('*** DATA:', rowData);
    //this.orderService.editOrder(orderId);
  }

}
