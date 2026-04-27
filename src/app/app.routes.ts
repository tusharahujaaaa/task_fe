import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
