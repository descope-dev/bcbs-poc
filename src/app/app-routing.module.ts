import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { descopeAuthGuard } from '@descope/angular-sdk';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { PromiseHomeComponent } from './promise-home/promise-home.component';
import { IdpLoginComponent } from './idp-login/idp-login.component';
import { importProvidersFrom } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'idp-login', component: IdpLoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [descopeAuthGuard],
    data: { descopeFallbackUrl: '/login' },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [descopeAuthGuard],
    data: { descopeFallbackUrl: '/login' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [descopeAuthGuard],
    data: { descopeFallbackUrl: '/login' },
  },
  { path: 'promise', component: PromiseHomeComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
];

export const routeProviders = [provideRouter(routes)];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
