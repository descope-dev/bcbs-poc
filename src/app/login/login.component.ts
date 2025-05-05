import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { DescopeAuthService } from '@descope/angular-sdk';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  descopeProjectId!: string;
  descopeBaseURL!: string;
  styleId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private descopeAuthService: DescopeAuthService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.descopeProjectId = environment.descopeProjectId;
    this.route.queryParams.subscribe((params) => {
      this.styleId = params['styleId'] || '';
      if (this.styleId === 'promise') {
        this.renderer.addClass(document.body, 'promise-theme');
        localStorage.setItem('styleId', 'promise');
      } else {
        this.renderer.removeClass(document.body, 'promise-theme');
        localStorage.removeItem('styleId');
      }
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'promise-theme');
  }

  onLoginSuccess(): void {
    // Redirect to dashboard after successful login
    this.router.navigate(['/dashboard']);
  }

  onError(e: CustomEvent) {
    console.log('ERROR FROM LOG IN FLOW', e.detail);
  }
}
