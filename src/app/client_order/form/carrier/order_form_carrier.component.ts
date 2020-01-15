import { Component, OnInit, Input, AfterViewInit, AfterContentInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { CountryService } from '../../../../shared/country.service';

// Structures and models
import { SelectOptions } from '../../../../models/select_options';
import { CountryModel } from '../../../../models/country.model';

@Component({
  selector: 'app-order-form-carrier',
  templateUrl: './order_form_carrier.component.html',
  styleUrls: ['./order_form_carrier.component.scss']
})

export class OrderFormCarrierComponent implements OnInit {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Select-Options for fields
  public countryOptions: CountryModel[];

  // Other fields
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;

  constructor(
    private countryService: CountryService
  ) {
  }

  ngOnInit() {

    // Get Country Options
    this.countryService.getAllCountries().subscribe(
      data => {
        // Set the form data with the order
        this.countryOptions = data.map(row => row);
      }
    );
  }

  // GETTERS
  get shipmentMethod() { return this.formData.get('general').get('shipmentMethod'); }


}
