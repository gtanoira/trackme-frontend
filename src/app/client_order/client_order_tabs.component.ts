import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material';

// App Components
import { COrderGridComponent } from './grid/grid.component';
import { COrderFormComponent } from './form/form.component';

// Services
import { CustomerOrderService } from '../../shared/customer_order.service';

/**
 * Customer Orders TAB manager
 * This component manages dynamically 2 components:
 * a) the customer orders grid component
 * b) the customer orders form component
 * And show these 2 components dynamically in tabs on the screen.
 * It can display these componenet more than once in different tabs
 */
@Component({
  templateUrl: './client_order_tabs.component.html',
  styleUrls:   ['./client_order_tabs.component.scss']
})
export class ClientOrderTabsComponent  {

  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;  // All tabs info that are available in the screen
  // @ViewChild('addGrid', {static: false}) addGridButton: MatTab;  // Info of the button "add a new grid"

  // cOrdersTabs[]: stores all the tab components the user opens.
  public cOrdersTabs = [];
  tabSelected = new FormControl(0);   // Info of the tab selected by clicking on it
  tabNo = 0;  // number to identify each tab

  constructor (
    private customerOrderService: CustomerOrderService,
    private el: ElementRef
  ) {

    // Add new Form Tab by doubleClick on a row in a grid
    this.customerOrderService.cOrderTab.subscribe(
      orderId => {
        if (orderId > 0) {
          this.addCOrdersFormTab(orderId);
        }
      }
    );

  }

  // Add a new Customer Order Grid tab
  addCOrdersGridTab() {
    this.tabNo += 1;
    // Add the new tab component to the dynamic array
    this.cOrdersTabs.push({
      label: `Grid (${this.tabNo})`,
      component: COrderGridComponent,
      inputs: {},  // tabGroup: this },
      outputs: {
        onSomething: (type) => {
          type.subscribe(
            data => { console.log('*** TYPE:', type); }
          );
        }
        /*
        //  .subscribe(orderId);
        //     => {
        console.log('*** SALIO:', orderId);
        this.addCOrdersFormTab(orderId);
        */
      },
    });
    // Set the tab active
    // The setTimeout() is a trick to get this work
    setTimeout(() => {
      this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1;
    }, 0);
  }

  addCOrdersFormTab(orderId: number = null) {
    this.tabNo += 1;
    this.cOrdersTabs.push({
      label: `Order (${this.tabNo})`,
      component: COrderFormComponent,
      inputs: { orderId },
      outputs: {}
    });
    // Set the tab active
    // The setTimeout() is a trick to get this work
    setTimeout(() => { this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1; }, 0);
  }

  removeTab(tab: any) {
    const index = this.cOrdersTabs.indexOf(tab);
    this.cOrdersTabs.splice(index, 1);
    if (index >= this.cOrdersTabs.length) {
      // Set the tab active
      // The setTimeout() is a trick to get this work
      setTimeout(() => { this.tabGroup.selectedIndex = this.cOrdersTabs.length - 1; }, 0);
    }
    /*
    if (this.tabSelected.value > this.cOrdersTabs.length - 1) {
      if (this.cOrdersTabs.length >= 1) {
        this.tabSelected.setValue(this.cOrdersTabs.length - 1);
      } else {
        this.tabSelected.setValue(0);
      }
    }
    */
  }

}
