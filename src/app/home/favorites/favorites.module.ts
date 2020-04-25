import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewFavoriteModalComponent } from '../modal/new-favorite-modal/new-favorite-modal.component';
import { FavoriteService } from '../../../service/favorite.service';
import { RecipeService } from '../../../service/recipe.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [FavoritesPage, NewFavoriteModalComponent],
  entryComponents: [NewFavoriteModalComponent],
  providers: [FavoriteService, RecipeService]
})
export class FavoritesPageModule {}
