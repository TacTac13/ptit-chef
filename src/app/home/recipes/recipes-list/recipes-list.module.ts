import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesListPageRoutingModule } from './recipes-list-routing.module';

import { RecipesListPage } from './recipes-list.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../../../application-pipe.module';
import { RecipeService } from '../../../../service/recipe.service';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesListPageRoutingModule,
    FontAwesomeModule,
    ApplicationPipesModule
  ],
  declarations: [RecipesListPage],
  providers: [RecipeService]
})
export class RecipesListPageModule { }
