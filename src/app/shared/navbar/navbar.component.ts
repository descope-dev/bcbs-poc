import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DescopeAuthService } from '@descope/angular-sdk';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() showDashboardLink = false;
  @Input() showApplicationsLink = false;
  @Input() showAdminLink = false;
  @Input() showUserDropdown = false;

  @ViewChild('userDropdown') userDropdown!: ElementRef;

  isDropdownOpen = false;
  user: any = null;

  constructor(
    private router: Router,
    private descopeAuthService: DescopeAuthService
  ) {
    // Subscribe to user changes
    this.descopeAuthService.user$.subscribe((descopeUser) => {
      if (descopeUser.user) {
        this.user = {
          name:
            descopeUser.user.name ||
            descopeUser.user.email?.split('@')[0] ||
            'Member',
          email: descopeUser.user.email,
          memberId: descopeUser.user.customAttributes?.['memberId'],
        };
      }
    });
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
}
