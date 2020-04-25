import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { NewUserModalComponent } from '../home/modal/new-user-modal/new-user-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [AuthPage, NewUserModalComponent],
  entryComponents: [NewUserModalComponent]
})
export class AuthPageModule {}
