import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { ClientOrderTabsComponent } from './client_order/client_order_tabs.component';
import { AuthGuard } from './_guards';
import { MainComponent } from './main_menu/main.component';

const appRoutes: Routes = [
  // Client's orders
  {
    path: 'pgmClientOrders',
    component: ClientOrderTabsComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'pgmClientOrders',
      nameProgram: 'Customer Orders'
    }
  },
  // Login
  {
    path: 'login',
    component: LoginComponent
  },
  // Main Menu
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  // otherwise redirect to Login
  { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
