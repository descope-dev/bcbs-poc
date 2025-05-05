import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promise-home',
  templateUrl: './promise-home.component.html',
  styleUrls: ['./promise-home.component.css'],
})
export class PromiseHomeComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login'], { queryParams: { styleId: 'promise' } });
  }
}
