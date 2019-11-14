// This components is for print error messages on the screen as Program title as well
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ErrorMessageService {

  // Messages: error, warning or info
  private formMessageSubject = new BehaviorSubject('');
  public  formCurrentMessage = this.formMessageSubject.asObservable();

  // Program Title
  private _appProgramTitle = new BehaviorSubject('');
  public  currentProgramTitle = this._appProgramTitle.asObservable();

  constructor() { }

  // Emit a message in the screen (message can be: error, warning or info)
  changeErrorMessage(message: string) {
    this.formMessageSubject.next(message);
  }

  // Emit a new program title on the screen
  changeAppProgramTitle(programTitle: string) {
    this._appProgramTitle.next(programTitle);
  }

}
