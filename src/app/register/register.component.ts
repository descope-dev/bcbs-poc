import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DescopeAuthService } from '@descope/angular-sdk';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  descopeProjectId!: string;

  constructor(
    private router: Router,
    private descopeAuthService: DescopeAuthService
  ) {}

  ngOnInit(): void {
    this.descopeProjectId = environment.descopeProjectId;
  }

  onRegisterSuccess(): void {
    // Redirect to dashboard after successful registration
    this.router.navigate(['/dashboard']);
  }

  onError(e: CustomEvent) {
    console.log('ERROR FROM REGISTER FLOW', e.detail);
  }
}
