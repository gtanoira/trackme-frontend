import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { ClientModel } from '../models/client.model';
import { ItemModelModel } from '../models/item_model.model';
import { ItemModel } from 'src/models/item.model';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class EntityService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all entites by type
  public getAllClients():  Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/clients.json`
    );
  }

  // Get all client's item models
  public getClientItemModels(clientId: number): Observable<ItemModelModel[]> {
    return this.http.get<ItemModelModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/item_models/${clientId}.json`
    ).pipe(
      map(data => data)
    );
  }

  // Get one client by Id
  public getEntityByid(entityId: number | string):  Observable<ClientModel> {
    return this.http.get<ClientModel>(
      `${environment.envData.dataBaseServer}/api/v1/clients/${(entityId == null) ? 0 : entityId}.json`
    );
  }

  // Save a new client item model
  public saveClientItemModels(itemModel: ItemModelModel): Observable<any> {
    return this.http.post<any>(
      `${environment.envData.dataBaseServer}/api/v1/item_models.json`,
      itemModel
    );
  }

}
