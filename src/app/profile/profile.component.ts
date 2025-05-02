import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize with defaults to prevent component from breaking
    this.user = {
      name: 'John Doe',
      email: 'member@bcbs.com',
      memberId: '123456789',
      phone: '(555) 123-4567',
    };

    this.authService
      .getUserData()
      .then((user) => {
        console.log('Profile component received user data:', user);

        // Only update user if data is received
        if (user) {
          this.user = {
            ...this.user,
            ...user,
          };
        }
      })
      .catch((error) => {
        console.error('Error fetching user data in profile component:', error);
        // Continue with default user data
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
