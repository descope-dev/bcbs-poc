import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DescopeAuthService } from '@descope/angular-sdk';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  descopeProjectId!: string;
  descopeBaseURL!: string;

  constructor(
    private router: Router,
    private descopeAuthService: DescopeAuthService
  ) {}

  ngOnInit(): void {
    this.descopeProjectId = environment.descopeProjectId;
  }

  onLoginSuccess(): void {
    // Redirect to dashboard after successful login
    this.router.navigate(['/dashboard']);
  }

  onError(e: CustomEvent) {
    console.log('ERROR FROM LOG IN FLOW', e.detail);
  }
}
