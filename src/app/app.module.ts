// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import {
  APP_INITIALIZER,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { GoogleChartsModule } from 'angular-google-charts';
import {
  DescopeAuthModule,
  DescopeAuthService,
  descopeInterceptor,
} from '@descope/angular-sdk';
import { environment } from '../environments/environment';
import { zip } from 'rxjs';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationsComponent } from './applications/applications.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { AuthService } from './auth.service';

export function initializeApp(authService: DescopeAuthService) {
  return () => zip([authService.refreshSession(), authService.refreshUser()]);
}

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    ApplicationsComponent,
    ProfileComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleChartsModule,
    DescopeAuthModule.forRoot({
      projectId: environment.descopeProjectId,
    }),
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [DescopeAuthService],
      multi: true,
    },
    provideHttpClient(withInterceptors([descopeInterceptor])),
    AuthService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
