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
    this.authService
      .getUserData()
      .then((user) => {
        if (user) {
          this.user = user;
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
