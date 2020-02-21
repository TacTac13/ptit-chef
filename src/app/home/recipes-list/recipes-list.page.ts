import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.page.html',
  styleUrls: ['./recipes-list.page.scss'],
})
export class RecipesListPage implements OnInit {

  recipesList: Recipe[];
  recipeType: string;

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

    this.recipeService.getRecipes(this.recipeType).subscribe(recipes => {
      this.recipesList = recipes;
    });

    console.log(this.recipesList);
  }

}
