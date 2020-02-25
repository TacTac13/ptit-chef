import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesListPageRoutingModule } from './recipes-list-routing.module';

import { RecipesListPage } from './recipes-list.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RatingModule } from 'ng-starrating';
import { MinuteSecondsPipe } from '../../../pipe/minute-seconds.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesListPageRoutingModule,
    FontAwesomeModule,
    RatingModule
  ],
  declarations: [RecipesListPage, MinuteSecondsPipe]
})
export class RecipesListPageModule {}
