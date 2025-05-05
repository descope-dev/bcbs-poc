import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isDropdownOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize with a default user object for the demo
    this.user = {
      name: 'BCBS Member',
      email: 'member@bcbs.com',
      isAdmin: true, // For demo purposes, all users are admins
      memberId: '123456789',
      phone: '(555) 123-4567',
    };

    this.authService
      .getUserData()
      .then((user) => {
        if (user) {
          // Keep the isAdmin property as true for demonstration
          this.user = {
            ...user,
            isAdmin: true,
          };
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
