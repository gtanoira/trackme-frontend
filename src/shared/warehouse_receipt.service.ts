import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { WarehouseReceiptCustomerOrderModel } from '../models/wr_corder.model';

@Injectable()
export class WarehouseReceiptService {

  data: any;

  constructor(
    private http: HttpClient
  ) {}

  // Get all the WR from a Customer Order
  getWareHouseReceiptsFromCOrder(customerOrderId: number):  Observable<WarehouseReceiptCustomerOrderModel[]> {
    return this.http.get<WarehouseReceiptCustomerOrderModel[]>(
      // tslint:disable-next-line: max-line-length
      `${environment.envData.dataBaseServer}/api/v1/warehouse_receipts/customer_order/get_ids/${(customerOrderId == null) ? 0 : customerOrderId}.json`
    );
  }

}
