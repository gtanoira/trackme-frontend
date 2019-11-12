import { Component, Input } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { style } from '@angular/animations';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div fxLayout="row" fxLayoutAlign="center">
      <div class="container">
        <div class="triangle"></div>
        <div class="triangle"></div>
      </div>
        <div class="container">
        <div class="triangle shadow"></div>
        <div class="triangle shadow"></div>
      </div>
      <i class="text"> {{this.params.loadingMessage}} </i>
    </div>
    `,
  styleUrls: ['./ag-grid_loading.component.scss']
})
export class AgGridLoadingComponent implements ILoadingOverlayAngularComp {

    params: any;

    agInit(params): void {
        this.params = params;
    }
}
