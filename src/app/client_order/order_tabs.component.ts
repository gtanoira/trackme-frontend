import { Component, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material';
import { Subscription } from 'rxjs';

// App Components
import { OrderGridComponent } from './grid/order_grid.component';
import { OrderFormTabsComponent } from './form/order_form_tabs.component';

// Services
import { OrderService } from '../../shared/order.service';

// Models
import { OrderGridModel } from '../../models/order_grid.model';

/**
 * Client Orders TAB manager
 * This component manages dynamically 2 components:
 * a) the client orders grid component
 * b) the client orders form component
 * And show these 2 components dynamically in tabs on the screen.
 * It can display these componenet more than once in different tabs
 */
@Component({
  selector: 'app-client-order-tabs',
  templateUrl: './order_tabs.component.html',
  styleUrls:   ['./order_tabs.component.scss']
})
export class OrderTabsComponent implements OnDestroy  {

  // All tabs info that are available in the screen
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;

  // Define OrdersTabs[]: stores all the tab components the user opens: WR or SH
  public ordersTabs = [];
  tabSelected = new FormControl(0);   // Info of the tab selected by clicking on it

  // Define Subscription
  private subsOrderData: Subscription;

  constructor (
    private orderService: OrderService,
  ) {

    // Set a subscriber to create a new tab each time a user double-clicks a row in a grid
    this.subsOrderData = this.orderService.orderTab.subscribe(
      orderData => {
        if (orderData) {
          this.addOrderFormTab(orderData);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subsOrderData.unsubscribe();
  }

  // Add a new Client Order Grid tab
  addOrderGridTab() {

    // Add the new tab component to the dynamic array
    this.ordersTabs.push({
      label: `Grid`,
      component: OrderGridComponent,
      inputs: {},
      outputs: {}
    });

    // Set the tab active
    // The setTimeout() is a trick to get this work
    setTimeout(() => { this.tabGroup.selectedIndex = this.ordersTabs.length - 1; }, 0);
  }

  // Add a new Client Order Form tab
  addOrderFormTab(orderData: OrderGridModel = null) {
    this.ordersTabs.push({
      label: orderData ? `${orderData.type === 'WarehouseReceipt' ? 'WR' : 'SH'} #${orderData.orderNo} (${orderData.clientAlias})` : 'NEW',
      component: OrderFormTabsComponent,
      inputs: { orderData },
      outputs: {}
    });

    // Set the tab active
    // The setTimeout() is a trick to get this work
    setTimeout(() => { this.tabGroup.selectedIndex = this.ordersTabs.length - 1; }, 0);
  }

  // Delete a tab
  removeTab(tab: any) {
    const index = this.ordersTabs.indexOf(tab);
    this.ordersTabs.splice(index, 1);
    if (index >= this.ordersTabs.length) {
      // Set the tab active
      // The setTimeout() is a trick to get this work
      setTimeout(() => { this.tabGroup.selectedIndex = this.ordersTabs.length - 1; }, 0);
    }
  }

}
