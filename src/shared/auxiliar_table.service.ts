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

@Injectable()
export class AuxiliarTableService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get Client Order Types Options
  getOrderTypes():  Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/order_type_options.json');
  }

  // Get Shipment Methods
  getShipmentMethods():  Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/shipment_method_options.json');
  }

  // Get Incoterms
  getIncoterms():  Observable<SelectOptions[]> {
    return this.http.get<SelectOptions[]>('assets/files/incoterm_options.json');
  }

}
