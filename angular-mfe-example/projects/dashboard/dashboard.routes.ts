import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  {path: '', loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent),
    children: [
    // path: 'heroes',  loadChildren: () => import('./../heroes/heroes.routes').then(r => r.heroesRoutes)
    {
      path: 'heroes',
      loadChildren: () =>
        import('heroes-mfe/heroes.routes').then((module) => module.heroesRoutes),
    }
    ]
  }
]
