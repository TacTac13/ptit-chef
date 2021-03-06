import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../../../service/recipe.service';
import { Recipe } from '../../../models/recipe.model';
import { faStar as faSolidStar, faWeight, faLeaf, faBars } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  constructor(
    private recipeService: RecipeService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { }

  recipesList: Recipe[];
  loadedrecipesList: Recipe[];
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faWeight = faWeight;
  faLeaf = faLeaf;
  faBars = faBars;
  recipesSub: Subscription;
  isLoading = false;
  skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  ngOnInit() { }

  private fetchAllRecipes(type: string) {
    this.isLoading = true;
    this.recipeService.fetchAllRecipes(type).subscribe(recipes => {
      for (const i of recipes) {
        this.recipesList.push(i);
        this.loadedrecipesList.push(i);
        this.isLoading = false;
      }
    });
  }

  ionViewWillEnter() {
    this.recipesList = [];
    this.loadedrecipesList = [];
    this.fetchAllRecipes('appetizer');
    this.fetchAllRecipes('main');
    this.fetchAllRecipes('dessert');
  }

  initializeItems(): void {
    this.recipesList = this.loadedrecipesList;
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }

  onClickRecipe(id: string, type: string) {
    this.loadingCtrl
      .create({ message: 'Chargement de la recette...' })
      .then(loadingEl => {
        loadingEl.present();
        this.recipeService.fetchRecipes(type).subscribe(() => {
          loadingEl.dismiss();
          this.navCtrl.navigateForward(`/home/tabs/recipes/${type}/${id}`);
        });
      });
  }

  filterList(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.recipesList = this.recipesList.filter(recipe => {
      if (recipe.title && searchTerm) {
        if (recipe.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  ngOnDestroy() {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }

}
