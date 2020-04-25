import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faBars, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from '../../../service/favorite.service';
import { Favorite } from '../../../models/favorites.model';
import { IonReorderGroup, ModalController, AlertController, NavController } from '@ionic/angular';
import { NewFavoriteModalComponent } from '../modal/new-favorite-modal/new-favorite-modal.component';
import { Subscription } from 'rxjs';

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
  isLoading = false;
  favoritesSub: Subscription;

  constructor(
    private favaoriteService: FavoriteService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.favoritesSub = this.favaoriteService.getFavorites().subscribe(favorites => {
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

  onEditItem(favoritId: string) {

    let favoritToEdit: Favorite;
    this.favoritesList.map(favorite => {
      if (favorite.id === favoritId) {
        favoritToEdit = {
          id: favorite.id,
          title: favorite.title,
          userId: favorite.userId,
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
          // this.isLoading = true;
          // this.recipesSub = this.recipeService.getRecipeFromId(
          //   this.route.snapshot.paramMap.get('recipeId'),
          //   this.route.snapshot.paramMap.get('recipeList')
          // ).subscribe((recipe: Recipe) => {
          //   this.recipe = recipe;
          //   this.isLoading = false;
          // });
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
            this.favaoriteService.deleteFavorit(favoritId).subscribe(() => {
              //this.navCtrl.navigateBack(`/home/tabs/recipes/${type}`);
            });
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
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

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }
}
