import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'recipes',
        children: [
          {
            path: '',
            loadChildren: () => import('./recipes/recipes.module').then( m => m.RecipesPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/recipes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
