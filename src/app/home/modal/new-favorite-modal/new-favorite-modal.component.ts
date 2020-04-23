import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { RecipeService } from 'src/service/recipe.service';
import { Recipe } from 'src/models/recipe.model';

@Component({
  selector: 'app-new-favorite-modal',
  templateUrl: './new-favorite-modal.component.html',
  styleUrls: ['./new-favorite-modal.component.scss'],
})
export class NewFavoriteModalComponent implements OnInit {

  faCheck = faCheck;
  faTimes = faTimes;
  faTrash = faTrash;
  faPlus = faPlus;
  form: FormGroup;
  recipesList: Recipe[];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private recipeService: RecipeService
  ) { }

  private fetchAllRecipes(type: string) {
    this.recipeService.fetchAllRecipes(type).subscribe(recipes => {
      for (const i of recipes) {
        this.recipesList.push(i);
      }
    });
  }

  ngOnInit() {
    this.recipesList = [];

    this.fetchAllRecipes('appetizer');
    this.fetchAllRecipes('main');
    this.fetchAllRecipes('dessert');

    this.form = this.fb.group({
      recipeName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

    console.log(this.recipesList);
    
  }

  onCreateFavorite() {

  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
