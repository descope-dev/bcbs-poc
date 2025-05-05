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
  activeSection: string = 'users'; // Default to users

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService
      .getUserData()
      .then((user) => {
        this.user = user;
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
