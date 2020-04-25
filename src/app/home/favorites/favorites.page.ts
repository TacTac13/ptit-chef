import { Component, OnInit, ViewChild } from '@angular/core';
import { faBars, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../models/favorites.model';
import { IonReorderGroup, ModalController } from '@ionic/angular';
import { NewFavoriteModalComponent } from '../modal/new-favorite-modal/new-favorite-modal.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  favoritesList: Favorite[] = [];
  faBars = faBars;
  faTrash = faTrash;
  faEdit = faEdit;
  isLoading = false;

  constructor(
    private favaoriteService: FavoriteService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.favaoriteService.getFavorites().subscribe(favorites => {
      this.favoritesList = favorites;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favaoriteService.fetchFavorites().subscribe(() => {
      this.isLoading = false;
    });
  }

  doReorder(event: any) {
    this.favoritesList = event.detail.complete(this.favoritesList);
  }

  onEditItem() {

  }

  onDeletetItem() {

  }

  onAddItem() {
    this.modalCtrl.create({ component: NewFavoriteModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }
}
