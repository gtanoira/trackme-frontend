import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

// External libraries
import * as moment from 'moment';

// Environment
import { environment } from '../environments/environment';

// Models
import { WarehouseModel } from 'src/models/warehouse.model';

@Injectable()
export class StockService {

  // Define Subject for new order event

  constructor(
    private http: HttpClient
  ) { }

  // Get all warehouses
  public getAllWarehouses():  Observable<WarehouseModel[]> {
    return this.http.get<WarehouseModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/warehouses.json`
    );
  }

}
