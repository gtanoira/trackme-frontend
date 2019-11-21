import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// Models
import { Menu } from '../../models/menu';
import { User } from '../../models/user';

// Services
import { AuthsService } from '../../shared/auths.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  // Define variables
  public  mainMenu: Observable<Menu[]>;
  private subsUserInfo: Subscription;
  public  userInfo: User;

  constructor (
    private authsService: AuthsService
  ) {
    this.mainMenu = this.authsService.mainMenuCache;
    // User Info
    this.subsUserInfo = this.authsService.currentUser.subscribe(
      data => this.userInfo = data
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subsUserInfo.unsubscribe();
  }

}
