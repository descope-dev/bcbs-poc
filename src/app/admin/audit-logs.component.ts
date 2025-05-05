import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audit-logs',
  template: `<div class="p-8">
    <div class="bg-white rounded-lg shadow-lg">
      <div class="border-b p-6">
        <h2 class="text-xl font-bold text-blue-900">Audit Logs</h2>
        <p class="text-gray-600 mt-1">
          Review system activity and user actions
        </p>
      </div>

      <div class="p-6">
        <!-- Container for Descope Audit widget -->
        <div #auditWidgetContainer></div>
      </div>
    </div>
  </div>`,
})
export class AuditLogsComponent implements OnInit {
  @ViewChild('auditWidgetContainer', { static: true })
  auditWidgetContainer!: ElementRef;

  ngOnInit() {
    // We'll initialize the audit widget programmatically to avoid Angular's component recognition issues
    setTimeout(() => {
      // Safety check to ensure the Descope global object exists
      if (typeof window !== 'undefined' && (window as any).Descope) {
        try {
          const auditWidget = document.createElement('audit-management');
          auditWidget.setAttribute('widgetId', 'audit-management-widget');
          this.auditWidgetContainer.nativeElement.appendChild(auditWidget);
        } catch (error) {
          console.error('Error creating audit management widget:', error);
        }
      } else {
        console.warn('Descope SDK not available for audit widget');
      }
    }, 500);
  }
}
