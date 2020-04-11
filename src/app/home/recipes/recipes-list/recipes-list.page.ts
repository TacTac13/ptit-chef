import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../../../../service/recipe.service';
import { Recipe } from '../../../../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faWeight, faBars,  faPlus} from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { NewRecipeModalComponent } from '../../modal/new-recipe-modal/new-recipe-modal.component';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.page.html',
  styleUrls: ['./recipes-list.page.scss'],
})
export class RecipesListPage implements OnInit, OnDestroy {

  recipesList: Recipe[];
  recipeType: string;
  title: string;
  noRecipeText: string;
  noRecipeTextButton: string;
  faAngleLeft = faAngleLeft;
  faLeaf = faLeaf;
  faBars = faBars;
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faWeight = faWeight;
  faPlus = faPlus;
  recipesSub: Subscription;
  isLoading = false;
  skeletonList = [1, 2, 3, 4, 5];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }


  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('recipeList')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    } else {
      this.recipeType = this.route.snapshot.paramMap.get('recipeList');
    }
    this.getText(this.recipeType);

    this.recipesSub = this.recipeService.getRecipes(this.recipeType).subscribe((recipes: Recipe[]) => {
      this.recipesList = recipes;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.recipeService.fetchRecipes(this.recipeType).subscribe(() => {
      this.isLoading = false;
    });
  }


  getText(recipeType: string) {
    switch (recipeType) {
      case 'appetizer':
        this.title = 'Entrée';
        this.noRecipeText = 'Vous n\'avez encore ajouté aucune entrée !';
        this.noRecipeTextButton = 'Ajoutez une entrée';
        break;
      case 'main':
        this.title = 'Plat principal';
        this.noRecipeText = 'Vous n\'avez encore ajouté aucun plat principal !';
        this.noRecipeTextButton = 'Ajoutez un plat principal';
        break;
      case 'dessert':
        this.title = 'Dessert';
        this.noRecipeText = 'Vous n\'avez encore ajouté aucun dessert !';
        this.noRecipeTextButton = 'Ajoutez un dessert';
        break;
    }
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }

  openNewRecipeModal() {
    this.modalCtrl.create({ component: NewRecipeModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }

}
