import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipeService } from '../../../../service/recipe.service';
import { Recipe } from '../../../../models/recipe.model';
import { faAngleLeft, faLeaf, faStar as faSolidStar, faWeight, faEllipsisH, faEdit, faTrash, faBars } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../modal/popover/popover.component';
import { FavoriteService } from '../../../../service/favorite.service';
import { Favorite } from '../../../../models/favorites.model';


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
  headerHeight: number;
  favSub: Subscription;
  favoritesList: Favorite[]

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private recipeService: RecipeService,
    private popoverController: PopoverController,
    private favoriteService: FavoriteService
  ) { }



  ngOnInit() {
    if (!this.route.snapshot.paramMap.has('recipeId')) {
      this.navCtrl.navigateBack('/home/tabs/recipes');
      return;
    }
    this.isLoading = true;
    this.recipesSub = this.recipeService.getRecipeFromId(
      this.route.snapshot.paramMap.get('recipeId'),
      this.route.snapshot.paramMap.get('recipeList')
    ).subscribe((recipe: Recipe) => {
      this.recipe = recipe;
      this.isLoading = false;
    });

    this.favSub = this.favoriteService.getFavorites().subscribe(favorites => {
      this.favoritesList = favorites;
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: {
        recipe: this.recipe,
        favoriteList: this.favoritesList
      },
      event: ev,
      translucent: false,
      
    });
    popover.style.cssText = '--min-width: 150px; --max-width: 150px; --backgroud-color: white;';

    popover.onDidDismiss()
    .then((result) => {
      if (!result.data.data.changeOfType) {
        this.isLoading = true;
            this.recipeService.getRecipeFromId(
              result.data.data.id,
              result.data.data.type
            ).subscribe((recipe: Recipe) => {
              console.log(recipe);
              this.recipe = recipe;
              this.isLoading = false;
            });        
      }
    });

    return await popover.present();
  }


  onScrole(event) {
    const toolbar = document.getElementById('bar2');
    if (event.detail.scrollTop > 150) {
      toolbar.classList.add('hide-toolbar');
    } else if (event.detail.scrollTop < 150) {
      toolbar.classList.remove('hide-toolbar');
    }
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

  ngOnDestroy() {
    if (this.recipesSub) {
      this.recipesSub.unsubscribe();
    }
    if (this.favSub) {
      this.favSub.unsubscribe();
    }
  }

}
