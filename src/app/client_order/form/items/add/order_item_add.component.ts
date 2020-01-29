import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, CheckboxControlValueAccessor, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Shared function
import { changeUnits } from 'src/shared/unitConversions';

// Services
import { AuthsService } from 'src/shared/auths.service';
import { AuxiliarTableService } from 'src/shared/auxiliar_table.service';
import { EntityService } from 'src/shared/entity.service';
import { ErrorMessageService } from 'src/shared/error-message.service';
import { OrderService } from 'src/shared/order.service';
import { StockService } from 'src/shared/stock.service';

// Models
import { ItemTypeModel } from 'src/models/item_type.model';
import { WarehouseModel } from 'src/models/warehouse.model';
import { ItemConditionModel } from 'src/models/item_condition.model';
import { ItemModel } from 'src/models/item.model';
import { ItemModelModel } from 'src/models/item_model.model';
import { UnitLengthModel } from 'src/models/unit_length.model';
import { UnitWeightModel } from 'src/models/unit_weight.model';
import { UnitVolumetricModel } from 'src/models/unit_volumetric.model';

@Component({
  selector: 'app-item-add',
  templateUrl: './order_item_add.component.html',
  styleUrls: ['./order_item_add.component.scss']
})
export class OrderItemAddComponent implements OnInit, OnDestroy {

  // Input parameters
  @Input() formData: FormGroup;

  // Define variables
  public itemForm: FormGroup;
  public itemTitle = 'item';

  // Define triggers
  private triggerUnitLength: Subscription;

  // Select options
  public warehouseOptions: WarehouseModel[];
  public itemTypeOptions: Observable<ItemTypeModel[]> = this.auxiliarTableService.getItemTypes();
  public conditionOptions: Observable<ItemConditionModel[]> = this.auxiliarTableService.getItemConditions();
  public itemModelsOptions: ItemModelModel[];
  public filteredModels: Observable<ItemModelModel[]>;
  public unitLengthOptions: Observable<UnitLengthModel[]> = this.auxiliarTableService.getUnitLengthOptions();
  public unitWeightOptions: Observable<UnitWeightModel[]> = this.auxiliarTableService.getUnitWeightOptions();
  public unitVolumetricOptions: Observable<UnitVolumetricModel[]> = this.auxiliarTableService.getUnitVolumetricOptions();

  constructor(
    private authsService: AuthsService,
    private auxiliarTableService: AuxiliarTableService,
    private entityService: EntityService,
    private errorMessageService: ErrorMessageService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private stockService: StockService
  ) {
    // Define form
    this.itemForm = this.fb.group({
      // Items type
      warehouseId: [this.authsService.userDefaultWarehouse(), this.enableItemId.bind(this)],
      itemType: ['box', this.enableItemId.bind(this)],
      condition: ['original'],
      unitLength: [this.authsService.userDefaultUnitLength()],
      unitWeight: [this.authsService.userDefaultUnitWeight()],
      unitVolumetric: [this.authsService.userDefaultUnitVolumetric()],
      // Item's data
      itemId: ['', [Validators.minLength(7),  this.validateItemId.bind(this)]],
      status: ['onhand'],
      quantity: [1],
      model: ['', this.validateModel.bind(this)],
      manufacter: [''],
      partNumber: [''],
      serialNumber: [''],
      uaNumber: [''],
      description: [''],
      width: [0],
      height: [0],
      length: [0],
      weight: [0],
      volumeWeight: [0]
    });
  }

  // GETTERS
  get clientId() { return this.formData.get('general').get('clientId'); }
  get itemId() { return this.itemForm.get('itemId'); }
  get itemType() { return this.itemForm.get('itemType'); }
  get model() { return this.itemForm.get('model'); }
  get orderId() { return this.formData.get('general').get('id'); }
  get uaNumber() { return this.itemForm.get('uaNumber'); }
  get unitLength() { return this.itemForm.get('unitLength'); }
  get unitWeight() { return this.itemForm.get('unitWeight'); }
  get unitVolumetric() { return this.itemForm.get('unitVolumetric'); }
  get warehouseId() { return this.itemForm.get('warehouseId'); }

  ngOnInit() {
    // Disable controls
    this.itemId.disable({onlySelf: this.warehouseId.invalid || this.itemType.invalid});

    // Get all Item Models from the client
    this.entityService.getClientItemModels(this.clientId.value).subscribe(
      data => this.itemModelsOptions = data,
      err => this.itemModelsOptions = []
    );

    // Get all Warehouses
    this.stockService.getAllWarehouses().subscribe(
      data => this.warehouseOptions = data,
      err => this.warehouseOptions = []
    );

    // Trigger for model (mat-autocomplete)
    this.filteredModels = this.model.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // Trigger for Unit Length
    this.triggerUnitLength = this.unitLength.valueChanges.subscribe(
      data => {
        const newUnits = changeUnits(data);
        this.unitWeight.setValue(newUnits['unitWeight']);
        this.unitVolumetric.setValue(newUnits['unitVolumetric']);
      }
    );
  }

  ngOnDestroy() {
    this.triggerUnitLength.unsubscribe();
  }

  // Display value for mat-autocomplete
  public displayFn(subject) {
    // subject es el contenido de [value] en <mat-option>
    return subject ? subject : undefined;
  }

  // Filter para mat-autocomplete 'model'
  private _filter(value: string): ItemModelModel[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value;
    return this.itemModelsOptions.filter(el => el.model.toLowerCase().includes(filterValue));
  }

  // Save a new event
  public createOrderItem() {

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
        'model': this.itemForm.get('model').value,
        'manufacter': this.itemForm.get('manufacter').value,
        'description': this.itemForm.get('description').value,
        'width': this.itemForm.get('width').value,
        'length': this.itemForm.get('length').value,
        'height': this.itemForm.get('height').value,
        'weight': this.itemForm.get('weight').value,
        'unitLength': this.itemForm.get('unitLength').value,
        'unitWeight': this.itemForm.get('unitWeight').value,
        'unitVolumetric': this.itemForm.get('unitVolumetric').value,
        'volumeWeight': this.itemForm.get('volumeWeight').value,
      };

      // Create item
      this.orderService.newOrderItem(this.orderId.value, orderItemData).subscribe(
        data => {
          this.errorMessageService.changeErrorMessage(data['message']);
        },
        err => {
          this.errorMessageService.changeErrorMessage(err);
        }
      );

      // Save the Item Model if it doesn't exists
      const itemModel: ItemModelModel = {
        'clientId': this.formData.get('general').get('clientId').value,
        'model': this.itemForm.get('model').value,
        'manufacter': this.itemForm.get('manufacter').value,
        'width': this.itemForm.get('width').value,
        'length': this.itemForm.get('length').value,
        'height': this.itemForm.get('height').value,
        'weight': this.itemForm.get('weight').value,
        'unitLength': this.itemForm.get('unitLength').value,
        'unitWeight': this.itemForm.get('unitWeight').value,
        'unitVolumetric': this.itemForm.get('unitVolumetric').value,
        'volumeWeight': this.itemForm.get('volumeWeight').value
      };
      this.entityService.saveClientItemModels(itemModel).subscribe(
        data => {
          // Add the new item model to itemModelsOptions
          this.itemModelsOptions.push(itemModel);
        },
        err => err
      );

      // Initialize form data
      this.itemForm.get('itemId').setValue('');
      this.itemForm.get('partNumber').setValue('');
      this.itemForm.get('serialNumber').setValue('');
      this.itemForm.get('uaNumber').setValue('');
      this.itemForm.get('description').setValue('');
    }
  }



  // Validator for intemId
  public validateItemId(control: FormControl): {[s: string]: boolean} {

    if (control.value && control.value.length >= 6) {
      /* The format itemId must be YYYYWWNNNNNNNN  where:
       *    YYYY: year
       *    WW: id warehouse where was first entered
       *    NNNNNNNN: number
       *
       *  This ID must be unique and the WW (warehouse ID) must exists in this account
      */
      return this.warehouseOptions.find(el => el.alias === control.value.substring(4, 6)) === undefined ? {'warehouseExists': false} : null;
    }
    return null;  // null means NO errors
  }

  // Validator for Warehouse and Item Type
  public enableItemId(control: FormControl): {[s: string]: boolean} {
    if (this.itemForm) {
      if (this.warehouseId.valid && this.itemType.valid) {
        this.itemId.enable();
      } else {
        this.itemId.disable();
      }
      // Set item Title
      this.itemTitle = this.itemType.value;
      // Enable or disable UA Number
      if (this.itemType.value === 'generic') {
        this.uaNumber.disable();
      } else {
        this.uaNumber.enable();
      }
    }
    return null;
  }

  // Validator for model
  public validateModel(control: FormControl): {[s: string]: boolean} {
    if (this.itemModelsOptions) {
      // Set unit measures to the item
      const itemModel = this.itemModelsOptions.find(el => el.model === control.value);
      console.log('***itemModel:', itemModel, control.value);
      if (itemModel) {
        // the model exists
        this.itemForm.get('manufacter').setValue(itemModel.manufacter);
        this.itemForm.get('unitLength').setValue(itemModel.unitLength);
        this.itemForm.get('width').setValue(itemModel.width);
        this.itemForm.get('length').setValue(itemModel.length);
        this.itemForm.get('height').setValue(itemModel.height);
        this.itemForm.get('unitWeight').setValue(itemModel.unitWeight);
        this.itemForm.get('weight').setValue(itemModel.weight);
        this.itemForm.get('unitVolumetric').setValue(itemModel.unitVolumetric);
        this.itemForm.get('volumeWeight').setValue(itemModel.volumeWeight);
      } else {
        // The model does not exists
        this.itemForm.get('manufacter').setValue('');
        this.itemForm.get('width').setValue(0);
        this.itemForm.get('length').setValue(0);
        this.itemForm.get('height').setValue(0);
        this.itemForm.get('weight').setValue(0);
        this.itemForm.get('volumeWeight').setValue(0);
      }
    }
    return null;
  }

}
