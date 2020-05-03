import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RecipesPage } from './recipes.page';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import 'hammerjs';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    RecipesPageRoutingModule,
    SwiperModule
  ],
  declarations: [RecipesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class RecipesPageModule {}
