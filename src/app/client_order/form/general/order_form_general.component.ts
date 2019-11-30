import { Component, OnInit, Input, AfterViewInit, AfterContentInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { AuxiliarTableService } from '../../../../shared/auxiliar_table.service';
import { OrderService } from '../../../../shared/order.service';
import { EntityService } from '../../../../shared/entity.service';
import { ErrorMessageService } from '../../../../shared/error-message.service';

// Structures and models
import { SelectOptions } from '../../../../models/select_options';

@Component({
  selector: 'app-order-form-general',
  templateUrl: './order_form_general.component.html',
  styleUrls: ['./order_form_general.component.scss']
})

export class OrderFormGeneralComponent implements OnInit {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Select-Options for fields
  public companyOptions: SelectOptions[];
  public clientOptions: SelectOptions[];
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

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get clientName() { return this.formData.get('general').get('clientName'); }
  get orderNo() { return this.formData.get('general').get('orderNo'); }
  get type() { return this.formData.get('general').get('type'); }

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

  // Save the Order to the DBase
  saveOrder(orderId) {

    // Clear message
    this.errorMessageService.changeErrorMessage('');
    // Save order
    this.orderService.updClientOrderById(orderId, this.formData).subscribe(
      data => {

        // Re-set the order for QUERY modality
        if (this.formData.value.formProperties.mode === 'INSERT') {
          this.formData.value.formProperties.mode = 'QUERY';
          this.formData.get('blkGeneral').get('clientId').disable();
          this.formData.get('blkGeneral').get('companyId').disable();
          this.formData.get('blkGeneral').get('orderNo').setValue(data['orderNo']);
          // this.orderId = data['id'];
          // Output message
          this.errorMessageService.changeErrorMessage(
            `The new client order #${this.orderNo.value} was created succesfuly`
          );
          setTimeout(() => { this.errorMessageService.changeErrorMessage(''); }, 10000);
        } else {
          this.formData.value.formProperties.mode = 'QUERY';
          // Output message
          this.errorMessageService.changeErrorMessage(
            `The order #${this.orderNo.value} was updated succesfuly`
          );
          setTimeout(() => { this.errorMessageService.changeErrorMessage(''); }, 10000);
        }
      },
      err => {
        this.errorMessageService.changeErrorMessage(err);
      }
    );

  }

}
