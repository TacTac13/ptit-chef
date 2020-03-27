import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faWeight, faEllipsisH, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { NewRecipeModalComponent } from '../modal/new-recipe-modal/new-recipe-modal.component';

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
  faEllipsisH = faEllipsisH;
  faWeight = faWeight;
  faEdit = faEdit;
  faTrash = faTrash;
  isDropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipeService: RecipeService,
    private modalCtrl: ModalController
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

  openDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onEditRecipe() {
    this.isDropdownOpen = false;
    this.modalCtrl.create({ component: NewRecipeModalComponent, componentProps: {
      Recipe: this.recipe,
    } }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

  onDeleteRecipe() {
    this.isDropdownOpen = false;
    const type = this.recipe.type;
    this.recipeService.deleteRecipe(this.recipe.id, type);
    this.navCtrl.navigateBack(`/home/tabs/recipes/${type}`);
  }


}
