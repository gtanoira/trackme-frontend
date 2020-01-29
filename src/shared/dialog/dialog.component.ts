import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// Models
import { DialogModalModel } from 'src/models/dialog_modal.model';

/*
  Example of how to open this dialog box and how to send data

  const dialogRef = this.dialog.open(DialogModalComponent, {
    width: '320px',
    data: {
      title: string,
      dialogType: string,  (Alert / Normal)
      body: string,
      btn1Text: string,
      btn2Text: string
    }
  });

  @data: is the object where all data is transfered to this component as input parameters

  The returned data is sent using the command:
  this.dialogRef.close(<data to return>);
  Where data could be anything

*/

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogModalComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModalModel
  ) {
    if (!data) {
      const data = {
        title: '',
        dialogType: 'Normal',
        body: '',
        btn1Text: 'Cancel',
        btn2Text: 'OK'
      }
    }
  }

  onBtnClick(btnNo: number): void {
    this.dialogRef.close(btnNo);
  }

}
