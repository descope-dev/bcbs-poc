import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DescopeAuthModule } from '@descope/angular-sdk';
import '@descope/web-component';

@Component({
  selector: 'app-idp-login',
  templateUrl: './idp-login.component.html',
  styleUrls: ['./idp-login.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DescopeAuthModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IdpLoginComponent implements OnInit {
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  loginWithIDP(): void {
    this.isLoading = true;
    this.error = null;

    this.authService
      .loginWithIDP()
      .catch((err) => {
        console.error('IDP login error:', err);
        this.error =
          'Failed to authenticate with identity provider. Please try again.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
