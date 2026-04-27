import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'plataforma',
    loadComponent: () => import('./plataforma/plataforma.page').then( m => m.PlataformaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./not-found/not-found.page').then( m => m.NotFoundPage)
  },
  {
    path: 'movimientos',
    loadComponent: () => import('./movements/movements.page').then( m => m.MovementsPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
