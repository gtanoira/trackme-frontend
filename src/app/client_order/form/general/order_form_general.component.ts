import { Component, OnInit, Input, AfterViewInit, AfterContentInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { AuxiliarTableService } from '../../../../shared/auxiliar_table.service';
import { OrderService } from '../../../../shared/order.service';
import { EntityService } from '../../../../shared/entity.service';
import { ErrorMessageService } from '../../../../shared/error-message.service';

// Models
import { SelectOptions } from '../../../../models/select_options';
import { ClientModel } from '../../../../models/client.model';

@Component({
  selector: 'app-order-form-general',
  templateUrl: './order_form_general.component.html',
  styleUrls: ['./order_form_general.component.scss']
})

export class OrderFormGeneralComponent implements OnInit, OnChanges {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Select-Options for fields
  public companyOptions: SelectOptions[];
  public clientOptions: ClientModel[];
  public orderTypeOptions: Observable<SelectOptions[]>;
  public shipmentOptions: Observable<SelectOptions[]>;
  public incotermOptions: Observable<SelectOptions[]>;

  // Other fields
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;

  constructor(
    private errorMessageService: ErrorMessageService,
    private auxiliarTableService: AuxiliarTableService,
    private orderService: OrderService,
    private entityService: EntityService,
  ) {
  }

  ngOnInit() {

    // Client Order Types Options
    this.orderTypeOptions = this.auxiliarTableService.getOrderTypes();
    // Incoterm Options
    this.incotermOptions = this.auxiliarTableService.getIncoterms();
    // Shipment Method
    this.shipmentOptions = this.auxiliarTableService.getShipmentMethods();

    // Get Client Options
    this.entityService.getAllClients().subscribe(
      data => {
        // Set the form data with the order
        this.clientOptions = data.map(row => row);
      }
    );
  }

  ngOnChanges() {
    // Set form fields validators
    if (this.formData !== undefined) {
      this.formData.get('general').get('clientId').setValidators(this.validateClientId.bind(this));
      this.formData.get('general').get('clientId').updateValueAndValidity();
    }
  }

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get clientName() { return this.formData.get('general').get('clientName'); }
  get orderNo() { return this.formData.get('general').get('orderNo'); }
  get type() { return this.formData.get('general').get('type'); }
  get thirdPartyId() { return this.formData.get('general').get('thirdPartyId'); }

  /* ngAfterContentInit() {
    if (this.orderId.value != null) {
      this.clientId.disable();
      this.companyId.disable();
    }
  } */

  openDropDown(option) {
    if (option === 'from') {
      this.showFromEntityDropDown = !this.showFromEntityDropDown;
    } else {
      this.showToEntityDropDown   = !this.showToEntityDropDown;
    }
  }

  // Validator for clientID
  validateClientId(control: FormControl): {[s: string]: boolean} {

    if (control.value) {
      // Set the Third Party Id if null
      if (this.thirdPartyId.value === '') {
        this.thirdPartyId.setValue(control.value);
      } else if (this.thirdPartyId.value !== control.value) {
        this.errorMessageService.changeErrorMessage('TRK-0008(I): please check the value for THIRD PARTY ID.')
      }

      // Set the companyId base on the client selected
      this.formData.get('general').get('companyId').setValue(
        this.clientOptions.find(el => el.id === control.value).companyId
      );
    }
    return null;  // null means NO errors
  }

}
