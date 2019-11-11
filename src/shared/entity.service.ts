import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { EntityModel } from '../models/entity.model';

@Injectable()
export class EntityService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get one entity by Id
  getEntityByid(entityId: number | string):  Observable<EntityModel> {
    return this.http.get<EntityModel>(
      `${environment.envData.loginServer}/api/v1/entities/${(entityId == null) ? 0 : entityId}.json`
    );
  }

  // Get all entites by type
  getAllEntitiesByType(typeId: string):  Observable<EntityModel[]> {
    return this.http.get<EntityModel[]>(
      `${environment.envData.loginServer}/api/v1/entities/type/${(typeId == null) ? 0 : typeId}.json`
    );
  }

}
