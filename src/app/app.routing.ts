import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { OrderTabsComponent } from './client_order/order_tabs.component';
import { AuthGuard } from './_guards';
import { MainComponent } from './main_menu/main.component';

const appRoutes: Routes = [
  // Client's orders
  {
    path: 'pgmClientOrders',
    component: OrderTabsComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'pgmClientOrders',
      nameProgram: 'Client Orders'
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
    canActivate: [AuthGuard],
    data: {
      idProgram: 'main',
      nameProgram: 'Home'
    }

  },
  // otherwise redirect to Login
  { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
