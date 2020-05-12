import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { RecipeService } from '../../../../service/recipe.service';
import { ModalController, PopoverController, AlertController, NavController } from '@ionic/angular';
import { NewRecipeModalComponent } from '../new-recipe-modal/new-recipe-modal.component';
import { Recipe } from '../../../../models/recipe.model';
import { Favorite } from '../../../../models/favorites.model';
import { FavoriteService } from 'src/service/favorite.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  faEdit = faEdit;
  faTrash = faTrash;
  isLoading = false;

  @Input() recipe: Recipe;
  @Input() favoriteList: Favorite[];

  constructor(
    private recipeService: RecipeService,
    private modalCtrl: ModalController,
    private popCtrl: PopoverController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit() {}


  onEditRecipe() {
    this.recipeService.oldType = this.recipe.type;
    this.modalCtrl.create({
      component: NewRecipeModalComponent, componentProps: {
        Recipe: this.recipe,
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {   
        this.popCtrl.dismiss(modalData);

      });
      modalEl.present();
    });
    
  }


  onDeleteRecipe() {
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
            this.favoriteList.map(favorite => {
              favorite.favoritesList.map((recipe, i)=> {
                if (recipe.id === this.recipe.id) {
                  favorite.favoritesList.splice(i, 1);
                }
              });
            });
            
            this.recipeService.deleteRecipe(this.recipe.id, type).subscribe(() => {
              this.favoriteList.map(favorite => {
                this.favoriteService.editFavorites(
                  favorite.id,
                  favorite.title,
                  favorite.userId,
                  favorite.pos,
                  favorite.favoritesList,
                  true
                ).subscribe();
              });
              this.navCtrl.navigateBack(`/home/tabs/recipes/${type}`);
              
            });
          }
        }
      ]
    }).then(alertEl => {
      this.popCtrl.dismiss();
      alertEl.present();
    });
  }


}
