import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';

import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule,
    NgxCarouselModule
  ],
  declarations: [RecipesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecipesPageModule {}
