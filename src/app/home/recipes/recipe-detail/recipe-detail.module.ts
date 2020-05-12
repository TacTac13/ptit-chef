import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApplicationPipesModule } from '../../../application-pipe.module';
import { PopoverComponent } from '../../modal/popover/popover.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
    FontAwesomeModule,
    ApplicationPipesModule
  ],
  declarations: [RecipeDetailPage, PopoverComponent],
  entryComponents:[PopoverComponent]
})
export class RecipeDetailPageModule {}
