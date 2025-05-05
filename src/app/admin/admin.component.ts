import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  user: any = null;
  isDropdownOpen = false;
  activeSection: string = 'users'; // Default to users

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get user data
    this.authService
      .getUserData()
      .then((user) => {
        this.user = user;
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    // Check for section query param
    this.route.queryParams.subscribe((params) => {
      if (
        params['section'] &&
        ['users', 'permissions', 'audit'].includes(params['section'])
      ) {
        this.activeSection = params['section'];
      }
    });
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    // Update URL query params without reloading the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: section },
      queryParamsHandling: 'merge',
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
