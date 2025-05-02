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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  user: any = null;
  isLoading = true;
  isDropdownOpen = false;
  selectedSection: 'users' | 'org' | 'permissions' | 'audit' = 'users';
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
          email: descopeUser.user.email || 'Loading...',
          phone: descopeUser.user.phone || 'Loading...',
          memberId: descopeUser.user.userId || 'Loading...',
          isAdmin: true, // For admin component, we'll assume admin access
        };
        this.isLoading = false;
      } else {
        // Fallback to auth service if needed
        this.authService
          .getUserData()
          .then((authUser) => {
            if (authUser) {
              this.user = {
                ...authUser,
                isAdmin: true, // Force admin access for admin component
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

  selectSection(section: 'users' | 'org' | 'permissions' | 'audit'): void {
    this.selectedSection = section;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  onSSOConfigSuccess() {
    // Handle successful SSO configuration
    console.log('SSO configuration completed successfully');
    // You can add additional logic here, such as showing a success message
    // or refreshing the page to show updated settings
  }

  logout(): void {
    this.descopeAuthService.descopeSdk.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
