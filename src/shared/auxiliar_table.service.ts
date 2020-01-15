/*
  This service retrieves all the data from the auxiliary tables in the sysytem.
  Some of them are located within the MySql DBase and others are simle JSON created here.
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Models
import { SelectOptions } from '../models/select_options';
import { ItemTypeModel } from 'src/models/item_type.model';
import { ItemConditionModel } from 'src/models/item_condition.model';
import { ItemStatusModel } from 'src/models/item_status.model';

@Injectable()
export class AuxiliarTableService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get Incoterms
  public getIncoterms(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/incoterm_options.json');
  }

  // Get Item Conditions
  public getItemConditions(): Observable<ItemConditionModel[]> {
    return this.http.get<ItemConditionModel[]>('assets/files/item_condition_options.json');
  }

  // Get Item Types
  public getItemTypes(): Observable<ItemTypeModel[]> {
    return this.http.get<ItemTypeModel[]>('assets/files/item_type_options.json');
  }

  // Get Item Status
  public getItemStatus(): Observable<ItemStatusModel[]> {
    return this.http.get<ItemStatusModel[]>('assets/files/item_status_options.json');
  }

  // Get Order Types Options
  public getOrderTypes(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/order_type_options.json');
  }

  //  Get Scope Options
  public getScopeOptions(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/scope_options.json');
  }

  // Get Shipment Methods
  public getShipmentMethods(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/shipment_method_options.json');
  }

  // Get Unit Length Options
  public getUnitLengthOptions(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/unit_length_options.json');
  }

  // Get Unit Weight Options
  public getUnitWeightOptions(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/unit_weight_options.json');
  }

  // Get Unit Volumetric Options
  public getUnitVolumetricOptions(): Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/unit_volumetric_options.json');
  }

}
