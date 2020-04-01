import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, switchMap, find } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public oldType: string;

  constructor(private authService: AuthService) {
  }


  // tslint:disable-next-line: variable-name
  private _mainRecipes = new BehaviorSubject<Recipe[]>(
    [
      {
        id: 'm1',
        title: 'Dhal au curry',
        type: 'main',
        imageUrl: 'https://static.750g.com/images/auto-427/06e0a3d7987f55ada249cc87cc759488/dhal.jpg',
        prepTime: 20,
        cookingTime: 20,
        totalTime: 40,
        yields: 4,
        star: [true, true, true, true, false],
        isVegie: true,
        isHealthy: true,
        country: 'IN',
        ingredients: [
          '250g de lentilles de corail',
          '2 tomates',
          '2 carottes',
          '2 oignons',
          'Une cuillère à soupe de curry',
          'Une cuillère à soupe de graam masala',
          'Huile d\'olive',
          'Sel poivre'
        ],
        direction: [
          'Lavez les lentilles, versez-les dans une casserole et couvrez-les d\'eau froide. Ajoutez le sel et faites cuire pendant 20 à 25 minutes. Retirez l\'écume au fur et à mesure.',
          'Emincez l\'oignon très finement.',
          'Faites revenir l\'oignon émincé dans du ghee (ou beurre), ajoutez les graines de cumin et laissez revenir.',
          'Râpez le gingembre et l\'ail et ajoutez-les dans la poêle.',
          'Ajoutez toutes les épices et un peu d\'eau. Laissez cuire 5 minutes.',
          'Coupez les tomates en petits dès et ajoutez-les dans le mélange oignon-épices.',
          'Quand les lentilles sont cuites, ajoutez-les dans la poêle, ajoutez un peu d\'eau et laissez cuire encore 10 minutes.',
          'Au moment de servir, ajoutez un filet d\'huile d\'olive et un peu de coriandre fraîche.'
        ],
        userId: 'abc'
      },
      {
        id: 'm2',
        title: 'Macaronni au fromage',
        type: 'main',
        imageUrl: 'https://static.cuisineaz.com/400x320/i9734-les-macaroni-au-fromage-de-modern-family.jpg',
        prepTime: 30,
        cookingTime: 40,
        totalTime: 70,
        yields: 4,
        star: [true, true, true, false, false],
        isVegie: true,
        isHealthy: false,
        country: 'IT',
        ingredients: [
          '600 g de macaronis',
          '200 g de cheddar râpé',
          '50 g de beurre',
          '70 cl de lait',
          '35 cl de lait',
          '2 c. à soupe de farine',
          'chapelure',
          'Sel poivre'
        ],
        direction: [
          'Faites cuire les macaroni dans une casserole remplie d\'eau bouillante salée en suivant les instructions du paquet.',
          'Quand les macaroni sont cuites, égouttez-les et réservez.',
          'Préchauffezle four à 180°C.',
          'Dans une casserole, faites fondre le beurre sur feu moyen. Ajoutez la farine puis le lait en continuant de remuer jusqu\'à ce que la sauce épaississe. Salez et poivrez.',
          'Ajoutez le cheddar et faites-le fondre dans la béchamel, en remuant bien.',
          'Versez les macaronis dans un plat à gratin puis recouvrez-les de sauce.',
          'Rectifiez l\'assaisonnement si besoin et parsemez de chapelure.',
          'Enfournez pendant 40 minutes.',
          'Dégustez bien chaud.',
        ],
        userId: 'abc'
      }
    ]);

  // tslint:disable-next-line: variable-name
  private _dessertRecipes = new BehaviorSubject<Recipe[]>([
    {
      id: 'd1',
      title: 'Fondant au chocolat',
      type: 'dessert',
      imageUrl: 'https://static.cuisineaz.com/400x320/i75546-fondant-au-chocolat-de-delphine.jpg',
      prepTime: 10,
      cookingTime: 7,
      totalTime: 17,
      yields: 6,
      star: [true, true, true, true, true],
      isVegie: true,
      isHealthy: false,
      country: 'FR',
      ingredients: [
        '250g de chocolat à dessert 53% cacao',
        '175g de beurre',
        '125g de sucre glace',
        '75g de farine',
        '5 oeufs'
      ],
      direction: [
        'Préchauffer le four à 220°',
        'Dans une casserole, faire fondre au bain marie le chocolat en morceaux et le beurre.',
        'Dans un bol, incorporer farine et sucre glace, puis ajouter les oeufs et mélanger jusqu\'à ce que la préparation soit homogène',
        'Beurrer et fariner 6 ramequins (environ 5 cm de haut par 7,5 cm de diamètre)',
        'Les remplir au 3/4 avec la préparation',
        'Enfourner 7 minutes précises à four bien chaud, déguster tiède avec une glace vanille'
      ],
      userId: 'abc'
    }
  ]);

  // tslint:disable-next-line: variable-name
  private _appetizerRecipes = new BehaviorSubject<Recipe[]>([
    {
      id: 'a1',
      title: 'Verrine de kiwi et saumon fumé',
      type: 'appetizer',
      imageUrl: 'https://static.750g.com/images/622-auto/ad7f44421b88e75913a53daaece36384/verrine-de-kiwi-et-saumon-fume.png',
      prepTime: 15,
      cookingTime: 0,
      totalTime: 15,
      yields: 8,
      star: [true, true, true, false, false],
      isVegie: false,
      isHealthy: false,
      country: 'FR',
      ingredients: [
        '4 kiwis',
        '4 tranches de saumon fumé',
        '20g de mayonnaise',
        '5cl de crème liquide',
        'Oeufs de lompe ou lump',
        '2 brins de ciboulette',
        '1 filer de citrons',
        'Sel poivre'
      ],
      direction: [
        'Couper les kiwis en petits dés, les déposer au fond des verrines.',
        'Détailler le saumon fumé en dés, les déposer sur les dés de kiwis.',
        'Faire un sauce en mélangeant la crème liquide avec la mayonnaise, le filet de citron et la ciboulette hachée finement. Repartir la sauce sur le saumon et le kiwi.',
        'Décorer avec des oeufs de lump et un brin de ciboulette.',
      ],
      userId: 'abc'
    }
  ]);

  // tslint:disable-next-line: variable-name
  private _allRecipeList = new BehaviorSubject<Recipe[]>([]);

  private findType(type: string) {
    if (type === 'main') {
      return this._mainRecipes;
    } else if (type === 'appetizer') {
      return this._appetizerRecipes;
    } else if (type === 'dessert') {
      return this._dessertRecipes;
    }
  }

  getRecipes(type: string): Observable<Recipe[]> {
    return this.findType(type).asObservable();
  }


  getRecipeFromId(id: string, type: string) {
    return this.findType(type).pipe(map((recipes: Recipe[]) => {
      return recipes.find(
        r => r.id === id
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

    let newRecipe: Recipe;
    const totalTime: number = cookingTime + prepTime;
    const recipeId: string = '_' + Math.random().toString(36).substr(2, 9);

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
      this.authService.userId
    );
    this.getRecipes(type).pipe(take(1)).subscribe(recipes => {
      if (type === 'main') {
        this._mainRecipes.next(recipes.concat(newRecipe));
      } else if (type === 'appetizer') {
        this._appetizerRecipes.next(recipes.concat(newRecipe));
      } else if (type === 'dessert') {
        this._dessertRecipes.next(recipes.concat(newRecipe));
      }
    });
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
    direction: string[]
  ) {
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
      this.authService.userId
    );

    this.getRecipes(type).pipe(take(1)).subscribe(recipes => {
      this.deleteRecipe(id, this.oldType);
      const updatedRecipeIndex = recipes.findIndex(rp => rp.id === id);
      if (updatedRecipeIndex !== -1) {
        updatedRecipesList = [...recipes];
        updatedRecipesList[updatedRecipeIndex] = updatedRecipe;
        if (type === 'main') {
          this._mainRecipes.next(updatedRecipesList);
        } else if (type === 'appetizer') {
          this._appetizerRecipes.next(updatedRecipesList);
        } else if (type === 'dessert') {
          this._dessertRecipes.next(updatedRecipesList);
        }
      } else {
        if (type === 'main') {
          this._mainRecipes.next(recipes.concat(updatedRecipe));
        } else if (type === 'appetizer') {
          this._appetizerRecipes.next(recipes.concat(updatedRecipe));
        } else if (type === 'dessert') {
          this._dessertRecipes.next(recipes.concat(updatedRecipe));
        }
      }
    }
    );
  }

  deleteRecipe(id: string, type: string) {
    let deleteRecipeList: Recipe[];
    this.getRecipes(type).pipe(take(1)).subscribe(recipes => {
      const deleteRecipeIndex = recipes.findIndex(rp => rp.id === id);
      deleteRecipeList = [...recipes];
      deleteRecipeList.splice(deleteRecipeIndex, 1);
      if (type === 'main') {
        this._mainRecipes.next(deleteRecipeList);
      } else if (type === 'appetizer') {
        this._appetizerRecipes.next(deleteRecipeList);
      } else if (type === 'dessert') {
        this._dessertRecipes.next(deleteRecipeList);
      }
    });
  }

  getAllRecipes() {
    const allRecipeList = [];

    this.getRecipes('appetizer').subscribe(recipes => {
      recipes.map(recipe => {
        allRecipeList.push(recipe);
      });
    });
    this.getRecipes('main').subscribe(recipes => {
      recipes.map(recipe => {
        allRecipeList.push(recipe);
      });
    });
    this.getRecipes('dessert').subscribe(recipes => {
      recipes.map(recipe => {
        allRecipeList.push(recipe);
      });
    });

    this._allRecipeList.next(allRecipeList);

    return this._allRecipeList.asObservable();
  }
}
