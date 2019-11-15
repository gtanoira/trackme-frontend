import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTabGroup, MatTab } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Structures and models
import { SelectOptions } from '../../../../models/select_options';

// Private Components
// import { WRFormComponent } from '../../../wr-form/form.component';

// Services
import { ErrorMessageService } from '../../../../shared/error-message.service';
import { CompanyService } from '../../../../shared/company.service';
import { CountryService } from '../../../../shared/country.service';
import { WarehouseReceiptService } from '../../../../shared/warehouse_receipt.service';

// Widgets

// HTTP options for calling API
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    // 'Accept': 'text/plain; application/json; text/html;',
  })
};
/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-custorder-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class COrderFormTabsComponent implements OnInit {
  @Input() orderId: number;
  @Input() formData: FormGroup;
  @Input() customerOptions: SelectOptions[];

  // Select-Options for fields
  countryOptions: SelectOptions[];
  companyOptions: SelectOptions[];

  // Define variables
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;
  @ViewChild('addWR', {static: false}) addWRTab: MatTab;
  public dynamicTabs = [];
  selected = new FormControl(0);

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private warehouseReceiptService: WarehouseReceiptService
  ) {}

  ngOnInit() {

    // Get Company Options
    this.companyService.getAllCompanies()
      .subscribe(data => {
        this.companyOptions = data.map(row => row);
      });

    // Get Country Options
    this.countryService.getAllCountries()
      .subscribe(data => {
        this.countryOptions = data.map(row => row);
      });

    // Load all Warehouse Receipts for the Customer Order
    this.addWRTabs(this.orderId);
  }

  // Add a new WR tab
  addWReceipt() {
    if (this.formData.value.formProperties.mode === 'INSERT') {
      this.errorMessageService.changeErrorMessage('TRK-0003(I): the form must be saved prior to this action');
    } else {
      this.dynamicTabs.push({
        label: 'WR-new',
        component: null,  // WRFormComponent,
        remove: true,
        inputs: {
          orderId: null,
          customerOrderForm: this.formData
        }
      });
      this.addWRTab.isActive = false;
      console.log('*** tabGroup: ', this.tabGroup);
      this.tabGroup.selectedIndex = 5 + this.dynamicTabs.length - 1;  // set active TAB
    }
  }

  // Get all WR belonging to the customer order <orderId>
  addWRTabs(customerOrderId: number) {
    // Get all WR Nos.
    this.warehouseReceiptService.getWareHouseReceiptsFromCOrder(customerOrderId)
      .subscribe(data => {
        for (const wr of data) {
          this.dynamicTabs.push({
            label: `WR#${wr.orderNo}`,
            remove: false,
            component: null, //WRFormComponent,
            inputs: {
              orderId: wr.id,
              customerOrderForm: this.formData
            }
          });
        }
        // Set active TAB
        this.tabGroup.selectedIndex = 5;
      });
  }

  changeTab(event: any) {
    this.errorMessageService.changeErrorMessage('');
    this.selected.setValue(event);
  }

  removeTab(tab: any) {
    console.log('*** TAB: ', tab);
    const index = this.dynamicTabs.indexOf(tab);
    this.dynamicTabs.splice(index, 1);  // delete component or tab
    if (this.selected.value > this.dynamicTabs.length - 1) {
      if (this.dynamicTabs.length >= 1) {
        this.selected.setValue(this.dynamicTabs.length - 1);
      } else {
        this.selected.setValue(0);
      }
    }
  }

}
