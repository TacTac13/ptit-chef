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
          },
          {
            path: ':recipeList',
            loadChildren: () => import('./recipes/recipes-list/recipes-list.module').then( m => m.RecipesListPageModule)
          },
          {
            path: ':recipeList',
            children: [
              {
                path: ':recipeId',
                loadChildren: () => import('./recipes/recipe-detail/recipe-detail.module').then( m => m.RecipeDetailPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
          }
        ]
      }
    ]
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
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
