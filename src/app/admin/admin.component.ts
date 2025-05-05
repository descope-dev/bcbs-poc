import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: any = null;
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initialize with default admin data for the demo
    this.user = {
      name: 'BCBS Admin',
      email: 'admin@bcbs.com',
      role: 'Admin',
      isAdmin: true,
      memberId: 'ADMIN123',
      phone: '(555) 123-4567',
    };

    this.authService
      .getUserData()
      .then((user) => {
        // For demo purposes, ensure all users have admin access
        this.user = {
          ...user,
          isAdmin: true, // Force admin access for demo
        };
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        // Don't redirect for demo purposes
      });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
