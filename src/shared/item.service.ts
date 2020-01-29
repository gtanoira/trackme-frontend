import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Models
import { ItemModel } from 'src/models/item.model';


@Injectable()
export class ItemService {

  constructor(
    private http: HttpClient
  ) {}

  // Delete an item
  public deleteItem(itemId: number):  Observable<any> {
    return this.http.delete(
      `${environment.envData.dataBaseServer}/api/v1/items/${(itemId == null) ? 0 : itemId}.json`
    );
  }

}
