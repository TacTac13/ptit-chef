import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../../../app/application-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
    FontAwesomeModule,
    ApplicationPipesModule
  ],
  declarations: [RecipeDetailPage]
})
export class RecipeDetailPageModule {}
