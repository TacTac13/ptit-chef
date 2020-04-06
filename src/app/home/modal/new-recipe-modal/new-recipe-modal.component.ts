import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { faCheck, faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalController, NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { countryList } from '../../../../shared/country-list';
import { RecipeService } from '../../../../service/recipe.service';

import { Recipe } from 'src/models/recipe.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-recipe-modal',
  templateUrl: './new-recipe-modal.component.html',
  styleUrls: ['./new-recipe-modal.component.scss'],
})
export class NewRecipeModalComponent implements OnInit {

  @ViewChildren('ingredientInput') ingredientInput: QueryList<any>;
  @ViewChildren('stepsInput') stepsInput: QueryList<any>;


  @Input() Recipe: Recipe;

  faCheck = faCheck;
  faTimes = faTimes;
  faTrash = faTrash;
  faPlus = faPlus;
  form: FormGroup;
  framework = '';
  rating: boolean[] = [];
  countryList = countryList;
  countryValue: string;
  countryText: string;
  vegieSwitch = false;
  healthySwitch = false;
  stars: number;
  ingredients = [''];
  steps = [''];
  selectedImage: string;
  selectOk = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private navCtrl: NavController,
    private loaderCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (this.Recipe) {
      this.vegieSwitch = this.Recipe.isVegie;
      this.healthySwitch = this.Recipe.isHealthy;

      this.stars = this.Recipe.star.filter(star => star === true).length;

      this.ingredients = this.Recipe.ingredients;
      this.steps = this.Recipe.direction;
    }

    this.form = this.fb.group({
      recipeName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      recipeType: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      prep: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      cook: new FormControl(null, {
        updateOn: 'blur'
      }),
      yields: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      country: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      rating: new FormControl(null),
      image: new FormControl(null),
      vegieSwitch: new FormControl(this.vegieSwitch, [Validators.required]),
      healthySwitch: new FormControl(this.healthySwitch, [Validators.required]),
      ingredients: new FormControl(null, {
        validators: [Validators.required]
      }),
      steps: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  countryValidator(event, country?) {
    console.log(event, this.selectOk);
    if (event.detail && !event.detail.value) {
      this.selectOk = true;
    } else if (!event.detail && country) {
      this.selectOk = false;
    } else if (!event.detail) {
      this.selectOk = true;
    } else {
      this.selectOk = false;
    }
  }

  addLine(line: string) {
    if (line === 'ingredients') {
      this.ingredients.push('');
    }
    if (line === 'steps') {
      this.steps.push('');
    }
  }

  removeLine(line: string, i: number) {
    if (line === 'ingredients') {
      this.ingredients = [];
      this.getTableMemory(this.ingredientInput, this.ingredients, true);
      this.ingredients.splice(i, 1);
    }
    if (line === 'steps') {
      this.steps = [];
      this.getTableMemory(this.stepsInput, this.steps, true);
      this.steps.splice(i, 1);
    }
  }


  onCancel() {
    this.modalCtrl.dismiss();
  }

  onImagePicked(imageData: string) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64', ''), 'image/jpeg');
      } catch (error) {
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  onSwitchChange(switchName: string) {
    this.form.value[switchName] = !this.form.value[switchName];
  }

  onCreateRecipe() {
    this.ingredients = [];
    this.steps = [];

    this.ingredients = this.getTableMemory(this.ingredientInput, this.ingredients, false);
    this.steps = this.getTableMemory(this.stepsInput, this.steps, false);

    if (this.rating.length === 0) {
      this.rating = [false, false, false, false, false];
    }

    this.loaderCtrl.create({
      message: 'Ajout de votre nouvelle recette...'
    }).then(loadingEl => {
      loadingEl.present();

      if (this.form.value.image) {
        const fr = new FileReader();
        fr.readAsDataURL(this.form.value.image);
        fr.onload = () => {
          this.selectedImage = fr.result.toString();
          this.recipeService.addRecipe(
            this.form.value.recipeName,
            this.form.value.recipeType,
            this.selectedImage,
            this.form.value.prep,
            this.form.value.cook ? this.form.value.cook : 0,
            this.form.value.yields,
            this.rating,
            this.form.value.vegieSwitch,
            this.form.value.healthySwitch,
            this.form.value.country,
            this.ingredients,
            this.steps,
          ).subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.modalCtrl.dismiss();
          });
        };
      } else {
        this.selectedImage = '';
        this.recipeService.addRecipe(
          this.form.value.recipeName,
          this.form.value.recipeType,
          this.selectedImage,
          this.form.value.prep,
          this.form.value.cook ? this.form.value.cook : 0,
          this.form.value.yields,
          this.rating,
          this.form.value.vegieSwitch,
          this.form.value.healthySwitch,
          this.form.value.country,
          this.ingredients,
          this.steps,
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.modalCtrl.dismiss();
        });
      }
    });
  }

  onEditRecipe() {
    this.ingredients = [];
    this.steps = [];

    this.ingredients = this.getTableMemory(this.ingredientInput, this.ingredients, false);
    this.steps = this.getTableMemory(this.stepsInput, this.steps, false);

    this.loaderCtrl.create({
      message: 'Modification de votre recette...'
    }).then(loadingEl => {
      loadingEl.present();
      if (this.form.value.image) {
        const fr = new FileReader();
        fr.readAsDataURL(this.form.value.image);
        fr.onload = () => {
          this.selectedImage = fr.result.toString();
          this.recipeService.updateRecipe(
            this.Recipe.id,
            this.form.value.recipeName ? this.form.value.recipeName : this.Recipe.title,
            this.form.value.recipeType ? this.form.value.recipeType : this.Recipe.type,
            this.selectedImage,
            this.form.value.prep ? this.form.value.prep : this.Recipe.prepTime,
            this.form.value.cook ? this.form.value.cook : this.Recipe.cookingTime,
            this.form.value.yields ? this.form.value.yields : this.Recipe.yields,
            this.rating.length !== 0 ? this.rating : this.Recipe.star,
            this.form.value.vegieSwitch,
            this.form.value.healthySwitch,
            this.form.value.country ? this.form.value.country : this.Recipe.country,
            this.ingredients ? this.ingredients : this.Recipe.ingredients,
            this.steps ? this.steps : this.Recipe.direction,
          ).subscribe(() => {
            if (this.form.value.recipeType && this.Recipe.type !== this.form.value.recipeType) {
              this.recipeService.deleteRecipe(this.Recipe.id, this.Recipe.type).subscribe(() => {
                this.navCtrl.navigateRoot(`/home/tabs/recipes/${this.form.value.recipeType}/${this.Recipe.id}`);
              });
            }
            this.modalCtrl.dismiss();
            loadingEl.dismiss();
          });
        };
      } else {
        this.recipeService.updateRecipe(
          this.Recipe.id,
          this.form.value.recipeName ? this.form.value.recipeName : this.Recipe.title,
          this.form.value.recipeType ? this.form.value.recipeType : this.Recipe.type,
          this.Recipe.imageUrl,
          this.form.value.prep ? this.form.value.prep : this.Recipe.prepTime,
          this.form.value.cook ? this.form.value.cook : this.Recipe.cookingTime,
          this.form.value.yields ? this.form.value.yields : this.Recipe.yields,
          this.rating.length !== 0 ? this.rating : this.Recipe.star,
          this.form.value.vegieSwitch,
          this.form.value.healthySwitch,
          this.form.value.country ? this.form.value.country : this.Recipe.country,
          this.ingredients ? this.ingredients : this.Recipe.ingredients,
          this.steps ? this.steps : this.Recipe.direction,
        ).subscribe(() => {
          if (this.form.value.recipeType && this.Recipe.type !== this.form.value.recipeType) {
            this.recipeService.deleteRecipe(this.Recipe.id, this.Recipe.type).subscribe();
            this.recipeService.fetchRecipes(this.form.value.recipeType).subscribe(() => {
              this.navCtrl.navigateRoot(`/home/tabs/recipes/${this.form.value.recipeType}/${this.Recipe.id}`);
            });
          }
          this.modalCtrl.dismiss();
          loadingEl.dismiss();
        });
      }
    });
  }

  onRate(event) {
    this.rating = [];
    const starsLeft: number = 5 - event.newValue;
    for (let i = 0; i < event.newValue; i++) {
      this.rating.push(true);
    }
    for (let j = 0; j < starsLeft; j++) {
      this.rating.push(false);
    }
  }

  private getTableMemory(input: QueryList<any>, table: string[], deleteMethode: boolean) {
    input.forEach((item) => {
      if (!deleteMethode && item.value) {
        table.push(item.value);
      } else if (deleteMethode) {
        table.push(item.value);
      }
    });
    return table;
  }

}
