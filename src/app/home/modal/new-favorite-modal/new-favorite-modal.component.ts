import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes, faTrash, faPlus, faWeight, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RecipeService } from '../../../../service/recipe.service';
import { FavoriteEL } from '../../../../models/favoritesEl.model';
import { FavoriteService } from '../../../../service/favorite.service';

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
  faWeight = faWeight;
  faLeaf = faLeaf;
  recipesList: any[];
  checkboxMax: any[] = [];
  favoriteName: string;

  constructor(
    private modalCtrl: ModalController,
    private recipeService: RecipeService,
    private alertCtrl: AlertController,
    private loaderCtrl: LoadingController,
    private favoriteService: FavoriteService,
    private toastController: ToastController
  ) { }

  private fetchAllRecipes(type: string) {
    this.recipeService.fetchAllRecipes(type).subscribe(recipes => {
      for (const i of recipes) {
        this.recipesList.push(i);
      }
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.recipesList.length; j++) {
        this.recipesList[j].isChecked = false;
      }
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  ngOnInit() {
    this.recipesList = [];
    this.fetchAllRecipes('appetizer');
    this.fetchAllRecipes('main');
    this.fetchAllRecipes('dessert');
  }

  onCheckboxClic(id: string, isChecked: boolean) {
    if (isChecked) {
      this.checkboxMax.push(id);
    } else if (!isChecked && id) {
      const pos = this.checkboxMax.indexOf(id);
      this.checkboxMax.splice(pos, 1);
    }
    if (this.checkboxMax.length > 10) {
      this.alertCtrl.create({
        header: 'Attention',
        message: 'Vous ne pouvez sélectionner que 10 recettes maximum par favoris',
        buttons: ['OK']
      }).then(alertEl => {
        this.recipesList.map(recipe => {
          if (recipe.id === id) {
            recipe.isChecked = false;
          }
        });
        alertEl.present();
      });
    }
  }

  getCoutryClass(code: string) {
    return 'flag-icon-' + code.toLowerCase();
  }


  onCreateFavorite() {
    const favoriteEl: FavoriteEL[] = [];
    this.recipesList.forEach(recipe => {
      if (recipe.isChecked) {
        favoriteEl.push({
          id: recipe.id,
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          stars: recipe.star,
          userId: recipe.userId
        });
      }
    });

    this.loaderCtrl.create({
      message: 'Ajout de votre nouveau favoris...'
    }).then(loadingEl => {
      loadingEl.present();
      this.favoriteService.addFavorites(
        this.favoriteName,
        favoriteEl
      ).subscribe(() => {
        loadingEl.dismiss();
        this.modalCtrl.dismiss();
        this.presentToast('Votre Favoris a bien été créé !');
      }
      );
    });

  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
