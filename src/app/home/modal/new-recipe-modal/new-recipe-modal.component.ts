import { Component, OnInit } from '@angular/core';

import { faCheck, faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { countryList } from '../../../../shared/country-list';
import { RecipeService } from '../../recipe.service';

import { StarRatingComponent } from 'ng-starrating';

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
  healthySwitch = false;
  vegieSwitch = false;
  selectedImage: string;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
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
        updateOn: 'blur',
        validators: [Validators.required]
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
      image: new FormControl(null, {
        validators: [Validators.required]
      }),
      vegieSwitch: new FormControl(false, {
        validators: [Validators.required]
      }),
      healthySwitch: new FormControl(false, {
        validators: [Validators.required]
      }),
      ingredients: new FormArray([this.initLine()]),
      steps: new FormArray([this.initLine()])
    });
  }

  get formControl() {
    return this.form.controls;
  }

  get ingredientsControl() {
    return this.formControl.ingredients as FormArray;
  }

  get stepsControl() {
    return this.formControl.steps as FormArray;
  }

  initLine() {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  addLine(line: string) {
    if (line === 'ingredients') {
      this.ingredientsControl.push(this.initLine());
    } else if (line === 'steps') {
      this.stepsControl.push(this.initLine());
    }
  }

  removeLine(line: string, i: number) {
    if (line === 'ingredients') {
      this.ingredientsControl.removeAt(i);
    } else if (line === 'steps') {
      this.stepsControl.removeAt(i);
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
        console.log(error);
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
    if (this.rating.length === 0) {
      this.rating = [false, false, false, false, false];
    }
    const fr = new FileReader();
    fr.readAsDataURL(this.form.value.image);
    fr.onload = () => {
      this.selectedImage = fr.result.toString();
      this.recipeService.addRecipe(
        this.form.value.recipeName,
        this.form.value.recipeType,
        this.selectedImage,
        this.form.value.prep,
        this.form.value.cook,
        this.form.value.yields,
        this.rating,
        this.form.value.vegieSwitch,
        this.form.value.healthySwitch,
        this.form.value.country,
        this.form.value.ingredients,
        this.form.value.steps,
      );
    };
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

}
