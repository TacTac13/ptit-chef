import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faWeight } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.page.html',
  styleUrls: ['./recipes-list.page.scss'],
})
export class RecipesListPage implements OnInit {

  recipesList: Recipe[];
  recipeType: string;
  title: string;
  faAngleLeft = faAngleLeft;
  faLeaf = faLeaf;
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faWeight = faWeight;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }


  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('recipeList')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    } else {
      this.recipeType = this.route.snapshot.paramMap.get('recipeList');
    }
    this.getTitle(this.recipeType);

    this.recipeService.getRecipes(this.recipeType).subscribe((recipes: Recipe[]) => {
      this.recipesList = recipes;
    });
  }

  getTitle(recipeType: string) {
    switch (recipeType) {
      case 'appetizer':
        this.title = 'Entrées';
        break;
      case 'main':
        this.title = 'Plats principals';
        break;
      case 'dessert':
        this.title = 'Desserts';
        break;
    }
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }

}
