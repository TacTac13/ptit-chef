import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewRecipeModalComponent } from './modal/new-recipe-modal/new-recipe-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [HomePage, NewRecipeModalComponent],
  entryComponents: [NewRecipeModalComponent],
})
export class HomePageModule {}
