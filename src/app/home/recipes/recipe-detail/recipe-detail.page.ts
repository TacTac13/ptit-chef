import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { RecipeService } from '../../../../service/recipe.service';
import { Recipe } from '../../../../models/recipe.model';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faWeight, faEllipsisH, faEdit, faTrash, faBars } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { NewRecipeModalComponent } from '../../modal/new-recipe-modal/new-recipe-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy {

  recipe: Recipe;
  recipeType: string;
  faAngleLeft = faAngleLeft;
  faLeaf = faLeaf;
  faStar = faSolidStar;
  faStar2 = faRegularStar;
  faEllipsisH = faEllipsisH;
  faBars = faBars;
  faWeight = faWeight;
  faEdit = faEdit;
  faTrash = faTrash;
  isDropdownOpen = false;
  recipesSub: Subscription;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipeService: RecipeService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('recipeId')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    }
    this.recipesSub = this.recipeService.getRecipeFromId(
      this.route.snapshot.paramMap.get('recipeId'),
      this.route.snapshot.paramMap.get('recipeList')
    ).subscribe((recipe: Recipe) => {
      this.recipe = recipe;
    });
  }

  ionViewWillEnter() {
    if (!this.route.snapshot.paramMap.has('recipeList')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    } else {
      this.recipeType = this.route.snapshot.paramMap.get('recipeList');
    }
    this.isLoading = true;
    this.recipeService.fetchRecipes(this.recipeType).subscribe(() => {
      this.isLoading = false;
    });
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }

  openDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onEditRecipe() {
    this.recipeService.oldType = this.recipe.type;
    this.isDropdownOpen = false;
    this.modalCtrl.create({
      component: NewRecipeModalComponent, componentProps: {
        Recipe: this.recipe,
      }
    }).then(modalEl => {
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

    this.alertCtrl.create({
      header: 'Supprimer la recette',
      message: 'Etes-vous sûr de vouloir supprimer cette recette ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ok', handler: () => {
            this.recipeService.deleteRecipe(this.recipe.id, type).subscribe(() => {
              this.navCtrl.navigateBack(`/home/tabs/recipes/${type}`);
            });
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
  }

}
