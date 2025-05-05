import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { DescopeAuthService } from '@descope/angular-sdk';
import { Router } from '@angular/router';

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
  sdk: any;

  constructor(private router: Router) {
    this.sdk = new DescopeAuthService({
      projectId: environment.descopeProjectId,
    });
  }

  async getUserData(): Promise<User> {
    try {
      const sessionToken = this.sdk.getSessionToken();
      console.log('Session token exists:', !!sessionToken);

      // DEMO APP: For this demo, we're going to set all users as admin
      // In a real app, this would be based on actual roles from Descope
      const isDemoAdmin = true;

      if (sessionToken && !this.sdk.isJwtExpired(sessionToken)) {
        try {
          const profile = await this.sdk.me(this.sdk.getRefreshToken());
          console.log('User profile from SDK:', profile);

          // In a real application, we'd check the actual role
          // For demo purposes, all users can access admin features
          const hasAdminRole =
            isDemoAdmin ||
            (profile.data.roleNames &&
              profile.data.roleNames.includes('admin')) ||
            profile.data.role === 'admin';

          const user: User = {
            name: profile.data.name || 'No Name Set',
            email: profile.userEmail || 'test@descope.com',
            role: profile.data.role || 'Admin',
            picture: profile.data.picture || '',
            isAdmin: hasAdminRole, // Always true for demo
            memberId: profile.data.memberId || '123456789',
            phone: profile.data.phone || '(555) 123-4567',
          };
          return user;
        } catch (error) {
          console.warn(
            'Error fetching profile, returning demo admin user',
            error
          );
          return this.getDemoAdminUser();
        }
      } else {
        // Token is expired or doesn't exist, try to refresh
        try {
          await this.sdk.refresh(this.sdk.getRefreshToken());
          const profile = await this.sdk.me(this.sdk.getRefreshToken());

          const hasAdminRole =
            isDemoAdmin ||
            (profile.data.roleNames &&
              profile.data.roleNames.includes('admin')) ||
            profile.data.role === 'admin';

          const user: User = {
            name: profile.data.name || 'No Name Set',
            email: profile.userEmail || 'test@descope.com',
            role: profile.data.role || 'Admin',
            picture: profile.data.picture || '',
            isAdmin: hasAdminRole, // Always true for demo
            memberId: profile.data.memberId || '123456789',
            phone: profile.data.phone || '(555) 123-4567',
          };
          return user;
        } catch (error) {
          console.warn(
            'Session refresh failed, returning demo admin user',
            error
          );
          return this.getDemoAdminUser();
        }
      }
    } catch (err) {
      console.error('getUserData error:', err);
      return this.getDemoAdminUser();
    }
  }

  // Provide default user data for the demo - with admin access
  private getDemoAdminUser(): User {
    return {
      name: 'BCBS Admin',
      email: 'admin@bcbs.com',
      role: 'Admin',
      picture: '',
      isAdmin: true, // Always true for demo
      memberId: 'ADMIN123',
      phone: '(555) 123-4567',
    };
  }

  // Standard member user (not used in demo, but kept for reference)
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
      await this.sdk.refresh();
      const sessionToken = this.sdk.getSessionToken();
      if (sessionToken && !this.sdk.isJwtExpired(sessionToken)) {
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
      await this.sdk.logout(this.sdk.getRefreshToken());
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout failed
      this.router.navigate(['/']);
    }
  }
}
