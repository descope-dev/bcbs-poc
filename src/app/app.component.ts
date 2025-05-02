import { Component, OnInit } from '@angular/core';
import { OneTapService } from './one-tap.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private oneTapService: OneTapService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      // Check if the user is authenticated
      const isAuthenticated = this.oneTapService.isAuthenticated();
      console.log('AppComponent - User authenticated:', isAuthenticated);

      if (!isAuthenticated) {
        // If the user is not authenticated and One Tap is not initialized, show One Tap
        if (!this.oneTapService.isOneTapInitialized()) {
          await this.oneTapService.displayOneTap();
        }
      } else {
        // Only redirect to dashboard if the user is at the root path
        if (this.router.url === '/' || this.router.url === '') {
          console.log('AppComponent - Navigating to dashboard from root path');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('AppComponent - Keeping current route:', this.router.url);
        }
      }
    } catch (error) {
      console.error('Error in app component initialization:', error);
      // Don't redirect on errors
    }
  }
}
