import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewRecipeModalComponent } from './modal/new-recipe-modal/new-recipe-modal.component';
import { ImagePickerComponent } from './modal/image-picker/image-picker.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { RatingModule } from 'ng-starrating';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    UiSwitchModule,
    RatingModule
  ],
  declarations: [HomePage, NewRecipeModalComponent, ImagePickerComponent],
  entryComponents: [NewRecipeModalComponent, ImagePickerComponent]
})
export class HomePageModule {}
