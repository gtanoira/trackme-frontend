import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { CountryModel } from '../models/country.model';

@Injectable()
export class CountryService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all countries
  getAllCountries():  Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>(
      `${environment.envData.loginServer}/api/v1/countries.json`
    );
  }

}
