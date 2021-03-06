
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomersComponent } from "./components/customers/customers.component";
import { ProductsListComponent } from "./components/products/products.component";
import { OrdersListComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { RegisterComponent } from './components/login/register.component';
import { RolesManagementComponent } from './components/controls/roles-management.component';
import { UsersManagementComponent } from './components/controls/users-management.component';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';

const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Home" } },
  { path: "login", component: LoginComponent, data: { title: "Login" } },
  { path: "register", component: RegisterComponent },
  { path: "roles", component: RolesManagementComponent },
  { path: "users", component: UsersManagementComponent },

  { path: "customers", component: CustomersComponent, canActivate: [AuthGuard], data: { title: "Customers" } },
  { path: "products", component: ProductsListComponent, canActivate: [AuthGuard], data: { title: "Products" } },
  { path: "orders", component: OrdersListComponent, canActivate: [AuthGuard], data: { title: "Orders" } },
  { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Settings" } },
  { path: "about", component: AboutComponent, data: { title: "About Us" } },
  { path: "home", redirectTo: "/", pathMatch: "full" },
  { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule { }
