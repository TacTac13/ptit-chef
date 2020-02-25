import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {

  recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('recipeId')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    }
    this.recipeService.getRecipeFromId(
      this.route.snapshot.paramMap.get('recipeId'), this.route.snapshot.paramMap.get('recipeList')
    ).subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        console.log(this.recipe);
      });
  }

}
