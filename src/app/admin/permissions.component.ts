import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-permissions',
  template: `<div class="p-8">
    <div class="bg-white rounded-lg shadow-lg">
      <div class="border-b p-6">
        <h2 class="text-xl font-bold text-blue-900">Role Management</h2>
        <p class="text-gray-600 mt-1">
          Manage role assignments and permissions
        </p>
      </div>

      <div class="p-6">
        <!-- Container for Descope Role widget -->
        <div #roleWidgetContainer></div>
      </div>
    </div>
  </div>`,
})
export class PermissionsComponent implements OnInit {
  @ViewChild('roleWidgetContainer', { static: true })
  roleWidgetContainer!: ElementRef;

  ngOnInit() {
    // We'll initialize the role widget programmatically to avoid Angular's component recognition issues
    setTimeout(() => {
      // Safety check to ensure the Descope global object exists
      if (typeof window !== 'undefined' && (window as any).Descope) {
        try {
          const roleWidget = document.createElement('role-management');
          roleWidget.setAttribute('widgetId', 'role-management-widget');
          this.roleWidgetContainer.nativeElement.appendChild(roleWidget);
        } catch (error) {
          console.error('Error creating role management widget:', error);
        }
      } else {
        console.warn('Descope SDK not available for role widget');
      }
    }, 500);
  }
}
