import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../../../application-pipe.module';
import { RecipeService } from 'src/service/recipe.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
    FontAwesomeModule,
    ApplicationPipesModule
  ],
  declarations: [RecipeDetailPage],
  providers: [RecipeService]
})
export class RecipeDetailPageModule {}
