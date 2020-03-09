import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {

  recipe: Recipe;
  recipeType: string;
  faAngleLeft = faAngleLeft;
  faLeaf = faLeaf;
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faHeartbeat = faHeartbeat;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {

    if (!this.route.snapshot.paramMap.has('recipeList')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    } else {
      this.recipeType = this.route.snapshot.paramMap.get('recipeList');
    }

    if (!this.route.snapshot.paramMap.has('recipeId')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    }


    this.recipeService.getRecipeFromId(
      this.route.snapshot.paramMap.get('recipeId'),
      this.route.snapshot.paramMap.get('recipeList')
    ).subscribe((recipe: Recipe) => {
        this.recipe = recipe;
      });
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }


}
