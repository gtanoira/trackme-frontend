import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { ClientModel } from '../models/client.model';

@Injectable()
export class EntityService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get one client by Id
  getEntityByid(entityId: number | string):  Observable<ClientModel> {
    return this.http.get<ClientModel>(
      `${environment.envData.loginServer}/api/v1/clients/${(entityId == null) ? 0 : entityId}.json`
    );
  }

  // Get all entites by type
  getAllClients():  Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(
      `${environment.envData.loginServer}/api/v1/clients.json`
    );
  }

}
