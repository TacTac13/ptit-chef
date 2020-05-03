import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBars, faStar, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from '../../../service/favorite.service';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { Favorite } from '../../../models/favorites.model';
import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { RecipeService } from '../../../service/recipe.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NewFavoriteModalComponent } from '../modal/new-favorite-modal/new-favorite-modal.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {


  faBars = faBars;
  faStar = faStar;
  faStar2 = faRegularStar;
  faHeart = faHeart;
  favoritesList: Favorite[];
  isLoading = false;
  favoritesSub: Subscription;
  index = 1;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  config = {
    slidesPerView: 'auto',
    spaceBetween: 25,
    freeMode: false,
    grabCursor: true,
  };


  constructor(
    private favoritesService: FavoriteService,
    private loadingCtrl: LoadingController,
    private recipeService: RecipeService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.favoritesSub = this.favoritesService.getFavorites().pipe(
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
        this.isLoading = false;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favoritesService.fetchFavorites().subscribe(() => {
      this.isLoading = false;
    });
  }

  onScrole(event) {
    const toolbar = document.getElementById('bar');
    if (event.detail.scrollTop > 400) {
      toolbar.classList.add('hide-toolbar');
    } else if (event.detail.scrollTop < 400) {
      toolbar.classList.remove('hide-toolbar');
    }
  }

  onRecipeClick(recipeId: string, recipeType: string) {
    this.loadingCtrl
      .create({ message: 'Chargement de la recette...' })
      .then(loadingEl => {
        loadingEl.present();
        this.recipeService.fetchRecipes(recipeType).subscribe(() => {
          loadingEl.dismiss();
          this.navCtrl.navigateForward(`/home/tabs/recipes/${recipeType}/${recipeId}`);
        });
      });
  }

  onAddFavorite() {
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

  getRecipeTitle(title: string) {
    if (title.length > 20) {
      return title.substring(0, 20) + '...';
    } else {
      return title;
    }
  }

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }

}
