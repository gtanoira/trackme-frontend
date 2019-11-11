import {Component, ViewEncapsulation} from '@angular/core';
import {ITooltipAngularComp} from "ag-grid-angular";

@Component({
    selector: 'tooltip-component',
    template: `
        <div class="custom-tooltip">
            <p><span>Fecha válida en SAP</span></p>
            <p>{{data.fechaCotizacion}}</p>
        </div>`,
    styles: [
        `
            :host {
                position: absolute;
                width: 150px;
                height: 50px;
                border: 1px solid cornflowerblue;
                overflow: hidden;
                pointer-events: none;
                transition: opacity 1s;
                background-color: lightyellow;
            }

            :host.ag-tooltip-hiding {
                opacity: 0;
            }

            .custom-tooltip p {
                margin: 5px;
                white-space: nowrap;
            }

            .custom-tooltip p:first-of-type {
                font-weight: bold;
            }
        `
    ]
})
export class CustomTooltip implements ITooltipAngularComp {

    private params: any;
    public  data: any;

    agInit(params): void {
        console.log('*** PARAMS: ', params);
        this.params = params;
        this.data = params.api.getRowNode(params.rowIndex).data;
        this.data.color = this.params.color || 'white';
    }
}