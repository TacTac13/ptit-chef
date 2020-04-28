import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBars, faStar } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from '../../../service/favorite.service';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { Favorite } from '../../../models/favorites.model';
import { LoadingController, NavController } from '@ionic/angular';
import { RecipeService } from '../../../service/recipe.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {

  faBars = faBars;
  faStar = faStar;
  faStar2 = faRegularStar;
  favoritesList: Favorite[];
  isLoading = false;
  favoritesSub: Subscription;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 451,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  constructor(
    private favoritesService: FavoriteService,
    private loadingCtrl: LoadingController,
    private recipeService: RecipeService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
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
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favoritesService.fetchFavorites().subscribe(() => {
      this.isLoading = false;
    });
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

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }

}
