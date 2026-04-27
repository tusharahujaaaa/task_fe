import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen relative overflow-hidden bg-surface-ground">
      <!-- Background Decorations -->
      <div class="absolute w-30rem h-30rem bg-primary border-circle blur-bg opacity-20" style="top: -10%; left: -10%;"></div>
      <div class="absolute w-30rem h-30rem bg-purple-500 border-circle blur-bg opacity-20" style="bottom: -10%; right: -10%;"></div>
      
      <div class="premium-card p-5 w-full md:w-30rem z-1 relative">
        <div class="text-center mb-5">
            <h2 class="text-3xl font-bold m-0 mb-2 text-color">{{ isLoginMode ? 'Welcome Back' : 'Create an Account' }}</h2>
            <p class="text-color-secondary m-0">
                {{ isLoginMode ? 'Sign in to jump back into your tasks.' : 'Sign up to start managing your workflow.' }}
            </p>
        </div>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
            
            <div class="flex flex-column gap-2" *ngIf="!isLoginMode">
                <label htmlFor="name" class="font-medium text-color">Full Name</label>
                <input pInputText id="name" formControlName="name" class="w-full p-3" placeholder="John Doe" />
            </div>

            <div class="flex flex-column gap-2">
                <label htmlFor="email" class="font-medium text-color">Email</label>
                <input pInputText id="email" formControlName="email" type="email" class="w-full p-3" placeholder="email@example.com" />
            </div>

            <div class="flex flex-column gap-2">
                <label htmlFor="password" class="font-medium text-color">Password</label>
                <p-password formControlName="password" [feedback]="!isLoginMode" styleClass="w-full" inputStyleClass="w-full p-3" [toggleMask]="true" placeholder="••••••••"></p-password>
            </div>

            <button pButton [label]="isLoginMode ? 'Sign In' : 'Sign Up'" [loading]="loading" class="w-full mt-2 p-3 font-bold"></button>
            
            <div class="text-center mt-3 text-color-secondary">
               {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
               <a href="javascript:void(0)" class="text-primary font-medium hover:underline cursor-pointer" (click)="toggleMode()">
                   {{ isLoginMode ? 'Sign Up' : 'Sign In' }}
               </a>
            </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .blur-bg { filter: blur(100px); }
  `]
})
export class Login {
  isLoginMode = true;
  loading = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    if (!this.isLoginMode) {
      this.authForm.addControl('name', this.fb.control('', Validators.required));
    } else {
      this.authForm.removeControl('name');
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.initForm();
  }

  onSubmit() {
    if (this.authForm.invalid) {
        this.messageService.add({severity:'error', summary:'Error', detail:'Please fill all required fields correctly.'});
        return;
    }

    this.loading = true;
    const authAction = this.isLoginMode 
        ? this.authService.login(this.authForm.value)
        : this.authService.register(this.authForm.value);

    authAction.subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Authentication successful.'});
        // Routing is handled in service
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.msg || 'Authentication failed. Please try again.';
        this.messageService.add({severity:'error', summary:'Error', detail: msg});
      }
    });
  }
}
