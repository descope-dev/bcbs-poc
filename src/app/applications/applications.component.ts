import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { DescopeAuthService } from '@descope/angular-sdk';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  user: any = null;
  isLoading = true;
  isDropdownOpen = false;
  private subscriptions: Subscription[] = [];

  @ViewChild('userDropdown') userDropdown!: ElementRef;

  constructor(
    private authService: AuthService,
    private descopeAuthService: DescopeAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to session changes
    const sessionSub = this.descopeAuthService.session$.subscribe((session) => {
      if (!session.isAuthenticated) {
        this.router.navigate(['/']);
        return;
      }
    });

    // Subscribe to user changes
    const userSub = this.descopeAuthService.user$.subscribe((descopeUser) => {
      if (descopeUser.user) {
        this.user = {
          name:
            descopeUser.user.name ||
            descopeUser.user.email?.split('@')[0] ||
            'Member',
          email: descopeUser.user.email,
          phone: descopeUser.user.phone,
          memberId: descopeUser.user.customAttributes?.['memberId'],
          isAdmin: true,
        };
        this.isLoading = false;
      } else {
        this.authService
          .getUserData()
          .then((authUser) => {
            if (authUser) {
              this.user = {
                ...authUser,
                isAdmin: true,
              };
            } else {
              this.router.navigate(['/']);
            }
            this.isLoading = false;
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            this.router.navigate(['/']);
          });
      }
    });

    this.subscriptions.push(sessionSub, userSub);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.descopeAuthService.descopeSdk.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
