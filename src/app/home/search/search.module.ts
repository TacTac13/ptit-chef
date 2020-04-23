import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SearchPage } from './search.page';
import { RecipeService } from 'src/service/recipe.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [SearchPage],
  providers: [RecipeService]
})
export class SearchPageModule {}
