import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faBars, faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../models/favorites.model';
import { IonReorderGroup, ModalController, AlertController } from '@ionic/angular';
import { NewFavoriteModalComponent } from '../modal/new-favorite-modal/new-favorite-modal.component';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  favoritesList: Favorite[] = [];
  faBars = faBars;
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  isLoading = false;
  favoritesSub: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.favoritesSub = this.favoriteService.getFavorites().pipe(
      switchMap(favorites => {
        this.favoritesList = [];
        if (favorites) {
          const temporaryList = [...favorites];
          const list = [];
          let index = 0;
          while (temporaryList.length > 0) {
            temporaryList.map((favorite) => {
              if (favorite.pos === index) {
                list.push(favorite);
                const favIndex = temporaryList.indexOf(favorite);
                temporaryList.splice(favIndex, 1);
                index++;
              }
            });
          }
          return list;
        }
      })).subscribe(favorites => {
        this.favoritesList.push(favorites);
      });
  }

  reorder() {

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favoriteService.fetchFavorites().subscribe(() => {
      this.isLoading = false;
    });
  }

  doReorder(event: any) {
    this.favoritesList = event.detail.complete(this.favoritesList);

    for (let i = 0; i < this.favoritesList.length; i++) {
      this.favoritesList[i].pos = i;
    }

    this.favoritesList.map(favorite => {
      this.favoriteService.editFavorites(
        favorite.id,
        favorite.title,
        favorite.userId,
        favorite.pos,
        favorite.favoritesList,
        false
      ).subscribe();
    });
  }

  onEditItem(favoritId: string) {
    let favoritToEdit: Favorite;
    this.favoritesList.map(favorite => {
      if (favorite.id === favoritId) {
        favoritToEdit = {
          id: favorite.id,
          title: favorite.title,
          userId: favorite.userId,
          pos: favorite.pos,
          favoritesList: favorite.favoritesList
        };
      }
    });
    this.modalCtrl.create({
      component: NewFavoriteModalComponent, componentProps: {
        favorite: favoritToEdit,
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

  onDeletetItem(favoritId: string) {
    this.alertCtrl.create({
      header: 'Supprimer le favoris',
      message: 'Etes-vous sûr de vouloir supprimer ce favoris ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ok', handler: () => {
            this.favoriteService.deleteFavorit(favoritId).subscribe();
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onAddItem() {
    this.modalCtrl.create({
      component: NewFavoriteModalComponent, componentProps: {
        pos: this.favoritesList.length,
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }
}
