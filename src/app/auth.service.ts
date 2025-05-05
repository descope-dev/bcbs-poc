import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { DescopeAuthService } from '@descope/angular-sdk';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

declare var Descope: any;

export interface User {
  name: string;
  email: string;
  role: string;
  picture: string;
  isAdmin?: boolean;
  memberId?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private descopeAuthService: DescopeAuthService,
    private router: Router
  ) {}

  async getUserData(): Promise<User> {
    try {
      // Get the current user from the Descope SDK
      const descopeUser = await firstValueFrom(this.descopeAuthService.user$);

      if (descopeUser && descopeUser.user) {
        console.log('User data from Descope:', descopeUser.user);

        // Check if user has admin role
        const hasAdminRole = this.hasAdminRole(descopeUser.user);

        return {
          name: descopeUser.user.name || 'No Name Set',
          email: descopeUser.user.email || '',
          role: Array.isArray(descopeUser.user.roleNames)
            ? descopeUser.user.roleNames[0]
            : 'User',
          picture: descopeUser.user.picture || '',
          isAdmin: hasAdminRole,
          memberId:
            descopeUser.user.customAttributes?.['memberId'] ||
            descopeUser.user.userId?.substring(0, 8) ||
            '',
          phone: descopeUser.user.phone || '',
        };
      } else {
        console.warn('No user data available from Descope, using fallback');
        return this.getDefaultUser();
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return this.getDefaultUser();
    }
  }

  private hasAdminRole(user: any): boolean {
    // Check if user has admin role from Descope
    if (user.roleNames && Array.isArray(user.roleNames)) {
      return user.roleNames.includes('admin');
    }
    return false;
  }

  // Fallback user data
  private getDefaultUser(): User {
    return {
      name: 'BCBS Member',
      email: 'member@bcbs.com',
      role: 'Member',
      picture: '',
      isAdmin: false,
      memberId: '123456789',
      phone: '(555) 123-4567',
    };
  }

  async validateSession(): Promise<any> {
    try {
      await this.descopeAuthService.descopeSdk.refresh();
      const sessionToken = this.descopeAuthService.getSessionToken();
      if (
        sessionToken &&
        !this.descopeAuthService.descopeSdk.isJwtExpired(sessionToken)
      ) {
        return "You're logged in!";
      } else {
        console.warn('Session validation failed but not redirecting');
        return 'Session invalid';
      }
    } catch (error) {
      console.warn('Session validation error but not redirecting:', error);
      return 'Error validating session';
    }
  }

  async logout(): Promise<void> {
    try {
      // Use the Descope SDK for logout
      await this.descopeAuthService.descopeSdk.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout failed
      this.router.navigate(['/login']);
    }
  }
}
