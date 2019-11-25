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
  getClientOrderTypes():  SelectOptions[] {
    return [
      { id: 'P', name: 'PickUp by Company' },
      { id: 'I', name: 'PickUp by Client' },
      { id: 'D', name: 'Delivery by Company' },
      { id: 'E', name: 'Delivery by Client' },
      { id: 'R', name: 'Replacement' }
    ];
  }

  // Get Order Status Options
  getOrderStatus():  SelectOptions[] {
    return [
      { id: 'P', name: 'Pending' },
      { id: 'C', name: 'Confirmed' },
      { id: 'F', name: 'Finished' },
      { id: 'A', name: 'Cancelled' }
    ];
  }

  // Get Shipment Methods
  getShipmentMethods():  SelectOptions[] {
    return [
      { id: 'A', name: 'Air' },
      { id: 'G', name: 'Ground' },
      { id: 'S', name: 'Sea' },
    ];
  }

  // Get Incoterms
  getIncoterms():  SelectOptions[] {
    return [
      { id: '   ', name: '' },
      { id: 'EXW', name: 'EXW - Ex Works' },
      { id: 'FCA', name: 'FCA - Free Carrier' },
      { id: 'FAS', name: 'FAS - Free Alongside Ship' },
      { id: 'FOB', name: 'FOB - Free On Board' },
      { id: 'CPT', name: 'CPT - Carriage Paid To' },
      { id: 'CFR', name: 'CFR - Cost and Freight' },
      { id: 'CIF', name: 'CIF - Cost, Insurance and Freight' },
      { id: 'CIP', name: 'CIP - Carriage and Insurance Paid to' },
      { id: 'DAT', name: 'DAT - Delivered At Terminal' },
      { id: 'DAP', name: 'DAP - Delivered At Place' },
      { id: 'DDU', name: 'DDU - Delivered Duty Unpaid' },
      { id: 'DDP', name: 'DDP - Delivered Duty Paid' },
    ];
  }

}
