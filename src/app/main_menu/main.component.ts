import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// Models
import { Menu } from '../../models/menu';

// Services
import { AuthsService } from '../../shared/auths.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // Define variables
  public mainMenu: Observable<Menu[]>;

  constructor (
    private authsService: AuthsService
  ) {
    this.mainMenu = this.authsService.mainMenuCache;
  }

  ngOnInit() {}

}
