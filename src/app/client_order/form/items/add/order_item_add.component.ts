import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { AuxiliarTableService } from 'src/shared/auxiliar_table.service';
import { ErrorMessageService } from 'src/shared/error-message.service';
import { OrderService } from 'src/shared/order.service';
import { StockService } from 'src/shared/stock.service';

// Models
import { ItemTypeModel } from 'src/models/item_type.model';
import { WarehouseModel } from 'src/models/warehouse.model';
import { ItemConditionModel } from 'src/models/item_condition.model';
import { ItemModel } from 'src/models/item.model';

@Component({
  selector: 'app-item-add',
  templateUrl: './order_item_add.component.html',
  styleUrls: ['./order_item_add.component.scss']
})
export class OrderItemAddComponent implements OnInit {

  // Input parameters
  @Input() formData: FormGroup;

  // Define variables
  public itemForm: FormGroup;
  public itemTitle = 'item';

  // Select options
  public warehouseOptions: Observable<WarehouseModel[]> = this.stockService.getAllWarehouses();
  public itemTypeOptions: Observable<ItemTypeModel[]> = this.auxiliarTableService.getItemTypes();
  public conditionOptions: Observable<ItemConditionModel[]> = this.auxiliarTableService.getItemConditions();

  constructor(
    private auxiliarTableService: AuxiliarTableService,
    private errorMessageService: ErrorMessageService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private stockService: StockService
  ) {
    // Define form
    this.itemForm = this.fb.group({
      warehouseId: ['', this.enableItemId.bind(this)],
      itemType: ['box', this.enableItemId.bind(this)],
      condition: ['original'],
      itemId: [''],
      status: ['onhand'],
      quantity: [1],
      partNumber: [''],
      serialNumber: [''],
      uaNumber: ['']
    });
  }

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get warehouseId() { return this.itemForm.get('warehouseId'); }
  get itemType() { return this.itemForm.get('itemType'); }
  get itemId() { return this.itemForm.get('itemId'); }

  ngOnInit() {
    // Disable controls
    this.itemId.disable({onlySelf: this.warehouseId.invalid || this.itemType.invalid});
  }

  // Validator for Warehouse and Item Type
  enableItemId(control: FormControl): {[s: string]: boolean} {
    if (this.itemForm) {
      if (this.warehouseId.valid && this.itemType.valid) {
        this.itemId.enable();
      } else {
        this.itemId.disable();
      }
      // Set item Title
      this.itemTitle = this.itemType.value;
    }
    return null;
  }

  // Validator for event
  validateEventId(control: FormControl): {[s: string]: boolean} {

    if (control.value) {
      // Set the scope
      // this.scope.setValue(this.events.find(el => el.id === control.value).scope);
    }
    return null;  // null means NO errors
  }

  // Save a new event
  public newOrderItem() {

    if (!this.orderId || this.orderId.value === 'NEW') {
      this.errorMessageService.changeErrorMessage('TRK-0003(I): the order must be saved prior to this action');

    } else {
      const orderItemData: ItemModel = {
        'itemId': this.itemId.value,
        'warehouseId': this.warehouseId.value,
        'clientId': this.formData.get('general').get('clientId').value,
        'orderId': this.orderId.value,
        'itemType': this.itemType.value,
        'status': this.itemForm.get('status').value,
        'quantity': this.itemForm.get('quantity').value,
        'partNumber': this.itemForm.get('partNumber').value,
        'serialNumber': this.itemForm.get('serialNumber').value,
        'uaNumber': this.itemForm.get('uaNumber').value,
        'condition': this.itemForm.get('condition').value,
      };

      this.orderService.newOrderItem(this.orderId.value, orderItemData).subscribe(
        data => {
          this.errorMessageService.changeErrorMessage(data['message']);
          // Render the Tracking Status Bar on Screen
          // this.orderService.setLastOrderEvent(this.orderId, this.scope.value);
        },
        err => {
          this.errorMessageService.changeErrorMessage(err);
        }
      );
    }
  }

}
