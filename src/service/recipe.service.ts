import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RecipeData } from '../models/recipe-data.model';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public oldType: string;

  constructor(private authService: AuthService, private http: HttpClient) {
  }


  // tslint:disable-next-line: variable-name
  private _mainRecipes = new BehaviorSubject<Recipe[]>([]);

  // tslint:disable-next-line: variable-name
  private _dessertRecipes = new BehaviorSubject<Recipe[]>([]);

  // tslint:disable-next-line: variable-name
  private _appetizerRecipes = new BehaviorSubject<Recipe[]>([]);

  private findType(type: string) {
    if (type === 'main') {
      return this._mainRecipes;
    } else if (type === 'appetizer') {
      return this._appetizerRecipes;
    } else if (type === 'dessert') {
      return this._dessertRecipes;
    }
  }

  private dispatchData(type: string, data: Recipe[]) {
    if (type === 'main') {
      this._mainRecipes.next(data);
    } else if (type === 'appetizer') {
      this._appetizerRecipes.next(data);
    } else if (type === 'dessert') {
      this._dessertRecipes.next(data);
    }
  }

  getRecipes(type: string): Observable<Recipe[]> {
    return this.findType(type).asObservable();
  }


  getRecipeFromId(id: string, type: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<RecipeData>(`https://ptit-chef.firebaseio.com/${type}/${id}.json?auth=${token}`);
      }),
      map(recipeData => {
        return new Recipe(
          id,
          recipeData.title,
          recipeData.type,
          recipeData.imageUrl,
          recipeData.prepTime,
          recipeData.cookingTime,
          recipeData.totalTime,
          recipeData.yields,
          recipeData.star,
          recipeData.isVegie,
          recipeData.isHealthy,
          recipeData.country,
          recipeData.ingredients,
          recipeData.direction,
          recipeData.userId
        );
      })
    );
  }

  fetchRecipes(type: string) {
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        return this.http.get<{ [key: string]: RecipeData }>(
          `https://ptit-chef.firebaseio.com/${type}.json?orderBy="userId"&equalTo="${userId}"&auth=${fetchedToken}`
        );
      }),
      take(1),
      map(resData => {
        const recipeDataList = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            recipeDataList.push(new Recipe(
              key,
              resData[key].title,
              resData[key].type,
              resData[key].imageUrl,
              resData[key].prepTime,
              resData[key].cookingTime,
              resData[key].totalTime,
              resData[key].yields,
              resData[key].star,
              resData[key].isVegie,
              resData[key].isHealthy,
              resData[key].country,
              resData[key].ingredients,
              resData[key].direction,
              resData[key].userId
            ));
          }
        }
        return recipeDataList;
      }),
      tap(recipes => {
        this.dispatchData(type, recipes);
      }));
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{ imageUrl: string, imagePath: string }>(
          'https://us-central1-ptit-chef.cloudfunctions.net/storeImage',
          uploadData,
          {headers: {
            Authorization: 'Bearer ' + token
            }
          }
      );
    }));
  }

  addRecipe(
    title: string,
    type: string,
    imageUrl: string,
    prepTime: number,
    cookingTime: number,
    yields: number,
    star: boolean[],
    isVegie: boolean,
    isHealthy: boolean,
    country: string,
    ingredients: string[],
    direction: string[]) {

    let generatedId: string;
    let newRecipe: Recipe;
    let fetechedToken: string;
    const totalTime: number = cookingTime + prepTime;
    const recipeId: string = '_' + Math.random().toString(36).substr(2, 9);

    if (imageUrl === '') {
      imageUrl = '../assets/img/place-holder.jpg';
    }

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetechedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        newRecipe = new Recipe(
          recipeId,
          title,
          type,
          imageUrl,
          prepTime,
          cookingTime,
          totalTime,
          yields,
          star,
          isVegie,
          isHealthy,
          country,
          ingredients,
          direction,
          userId
        );
        return this.http.post<{ name: string }>(`https://ptit-chef.firebaseio.com/${type}.json?auth=${fetechedToken}`, { ...newRecipe, id: null });
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.getRecipes(type);
      }),
      take(1),
      tap(recipes => {
        newRecipe.id = generatedId;
        this.dispatchData(type, recipes.concat(newRecipe));
      })
    );
  }

  updateRecipe(
    id: string,
    title: string,
    type: string,
    imageUrl: string,
    prepTime: number,
    cookingTime: number,
    yields: number,
    star: boolean[],
    isVegie: boolean,
    isHealthy: boolean,
    country: string,
    ingredients: string[],
    direction: string[],
    userId: string
  ) {

    let fetchedToken: string;
    let updatedRecipesList: Recipe[];
    const totalTime: number = cookingTime + prepTime;
    const updatedRecipe: Recipe = new Recipe(
      id,
      title,
      type,
      imageUrl,
      prepTime,
      cookingTime,
      totalTime,
      yields,
      star,
      isVegie,
      isHealthy,
      country,
      ingredients,
      direction,
      userId
    );

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.getRecipes(type);
      }),
      take(1),
      switchMap(recipes => {
        const updatedRecipeIndex = recipes.findIndex(rp => rp.id === id);
        updatedRecipesList = [...recipes];
        updatedRecipesList[updatedRecipeIndex] = updatedRecipe;
        return this.http.put(`https://ptit-chef.firebaseio.com/${type}/${id}.json?auth=${fetchedToken}`, { ...updatedRecipesList[updatedRecipeIndex], id: null });
      }),
      tap(() => {
        this.dispatchData(type, updatedRecipesList);
      })
    );
  }

  deleteRecipe(id: string, type: string): any {
    let deleteRecipeList: Recipe[];
    let fetechedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetechedToken = token;
        return this.getRecipes(type);
      }),
      take(1),
      switchMap(recipes => {
        const deleteRecipeIndex = recipes.findIndex(rp => rp.id === id);
        deleteRecipeList = [...recipes];
        deleteRecipeList.splice(deleteRecipeIndex, 1);
        return this.http.delete(`https://ptit-chef.firebaseio.com/${type}/${id}.json?auth=${fetechedToken}`);
      }),
      tap(() => {
        this.dispatchData(type, deleteRecipeList);
      }));
  }

  fetchAllRecipes(type: string) {
    let fetechedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetechedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        return this.http.get<{ [key: string]: RecipeData }>(
          `https://ptit-chef.firebaseio.com/${type}.json?orderBy="userId"&equalTo="${userId}"&auth=${fetechedToken}`
        );
      }),
      take(1),
      map(resData => {
        const recipeAllDataList = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            recipeAllDataList.push(new Recipe(
              key,
              resData[key].title,
              resData[key].type,
              resData[key].imageUrl,
              resData[key].prepTime,
              resData[key].cookingTime,
              resData[key].totalTime,
              resData[key].yields,
              resData[key].star,
              resData[key].isVegie,
              resData[key].isHealthy,
              resData[key].country,
              resData[key].ingredients,
              resData[key].direction,
              resData[key].userId
            ));
          }
        }
        return recipeAllDataList;
      }),
    );
  }
}
