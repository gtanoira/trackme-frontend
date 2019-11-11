import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { EventTypeModel } from '../models/event_type.model';

@Injectable()
export class EventTypeService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all event types
  getAllEventTypes():  Observable<EventTypeModel[]> {
    return this.http.get<EventTypeModel[]>(
      `${environment.envData.loginServer}/api/v1/event_types.json`
    );
  }

}
