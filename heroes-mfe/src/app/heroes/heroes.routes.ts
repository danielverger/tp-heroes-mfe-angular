import { Routes } from '@angular/router';

export const heroesRoutes: Routes = [
  {path: '', loadComponent: () => import('./heroes-list/heroes-list.component').then(c => c.HeroesListComponent)},
  {path: 'add', loadComponent: () => import('./hero-modify/hero-modify.component').then(c => c.HeroModifyComponent), data: {title: 'Add Hero'} },
  {path: ':id', loadComponent: () => import('./hero-modify/hero-modify.component').then(c => c.HeroModifyComponent), data: {title: 'Modify Hero'}},
];
