import { Component, OnInit, Input, AfterViewInit, AfterContentInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { CountryService } from '../../../../shared/country.service';

// Structures and models
import { SelectOptions } from '../../../../models/select_options';
import { CountryModel } from '../../../../models/country.model';

@Component({
  selector: 'app-order-form-shipper',
  templateUrl: './order_form_shipper.component.html',
  styleUrls: ['./order_form_shipper.component.scss']
})

export class OrderFormShipperComponent implements OnInit {

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

  openDropDown(option) {
    if (option === 'from') {
      this.showFromEntityDropDown = !this.showFromEntityDropDown;
    } else {
      this.showToEntityDropDown   = !this.showToEntityDropDown;
    }
  }

}
