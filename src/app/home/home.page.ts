import { Component } from '@angular/core';

import { faSearch, faHamburger, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { NewRecipeModalComponent } from '../../app/home/modal/new-recipe-modal/new-recipe-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  faSearch = faSearch;
  faHamburger = faHamburger;
  faPlus = faPlus;

  constructor(private modalCtrl: ModalController) {}

  openNewRecipeModal() {
    this.modalCtrl.create({ component: NewRecipeModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

}
