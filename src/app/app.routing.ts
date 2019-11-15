import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { CustomerOrderTabsComponent } from './client_order/customer_order_tabs.component';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
 {
    path: 'pgmClientOrders',
    component: CustomerOrderTabsComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'pgmClientOrders',
      nameProgram: 'Customer Orders'
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // otherwise redirect to Lgin
  { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
