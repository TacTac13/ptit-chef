import { Component, OnInit } from '@angular/core';

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-recipe-modal',
  templateUrl: './new-recipe-modal.component.html',
  styleUrls: ['./new-recipe-modal.component.scss'],
})
export class NewRecipeModalComponent implements OnInit {

  faCheck = faCheck;
  faTimes = faTimes;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  onCancel() {
    this.modalCtrl.dismiss();
    console.log("fe");
    
  }

}
