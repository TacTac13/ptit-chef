import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/service/recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { faStar as faSolidStar, faWeight, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

  constructor(private recipeService: RecipeService, private navCtrl: NavController) { }

  recipesList: Recipe[];
  loadedrecipesList: Recipe[];
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faWeight = faWeight;
  faLeaf = faLeaf;
  recipesSub: Subscription;

  ngOnInit() {
    this.recipesSub = this.recipeService.getAllRecipes().subscribe( recipes => {
      this.recipesList = recipes;
      this.loadedrecipesList = recipes;
    });
  }

  initializeItems(): void {
    this.recipesList = this.loadedrecipesList;
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }

  onClickRecipe(id: string, type: string) {
    this.navCtrl.navigateForward(`/home/tabs/recipes/${type}/${id}`);
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
