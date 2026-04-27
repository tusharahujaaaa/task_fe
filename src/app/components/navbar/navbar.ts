import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ToolbarModule],
  template: `
    <p-toolbar styleClass="bg-surface-section border-none shadow-1 py-3 px-5 border-round-none premium-card">
        <div class="p-toolbar-group-start">
            <div class="flex align-items-center gap-2 cursor-pointer" routerLink="/">
                <i class="pi pi-check-circle text-primary text-3xl"></i>
                <span class="font-bold text-2xl text-primary">TaskMaster</span>
            </div>
        </div>
        <div class="p-toolbar-group-end gap-3 flex align-items-center" *ngIf="authService.isAuthenticated$ | async as isAuthenticated; else unauth">
            <button pButton label="Logout" (click)="authService.logout()" class="p-button-outlined p-button-secondary"></button>
            <button pButton label="Dashboard" routerLink="/dashboard" class="p-button-primary"></button>
        </div>
        <ng-template #unauth>
             <div class="p-toolbar-group-end gap-3 flex align-items-center">
                <button pButton label="Features" class="p-button-text p-button-plain hidden md:flex"></button>
                <button pButton label="Pricing" class="p-button-text p-button-plain hidden md:flex"></button>
                <button pButton label="Sign In" routerLink="/login" class="p-button-primary"></button>
            </div>
        </ng-template>
    </p-toolbar>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Navbar {
   constructor(public authService: AuthService) {}
}
