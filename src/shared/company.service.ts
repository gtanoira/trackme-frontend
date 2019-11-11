import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { CompanyModel } from '../models/company.model';

@Injectable()
export class CompanyService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all entites by type
  getAllCompanies():  Observable<CompanyModel[]> {
    return this.http.get<CompanyModel[]>(
      `${environment.envData.loginServer}/api/v1/companies.json`
    );
  }

}
