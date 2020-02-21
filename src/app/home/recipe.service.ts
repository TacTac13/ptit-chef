import { Injectable } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  // tslint:disable-next-line: variable-name
  private _mainRecipes = new BehaviorSubject<Recipe[]>([
    {
      id: 'm1',
      title: 'Dhal au curry',
      imageUrl: 'https://static.750g.com/images/auto-427/06e0a3d7987f55ada249cc87cc759488/dhal.jpg',
      prepTime: 20,
      cookingTime: 20,
      yields: 4,
      star: 4,
      isVegie: true,
      isHealthy: true,
      countrie: 'Inde',
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
    },
    {
      id: 'm2',
      title: 'Macaronni au fromage',
      imageUrl: 'https://static.cuisineaz.com/400x320/i9734-les-macaroni-au-fromage-de-modern-family.jpg',
      prepTime: 30,
      cookingTime: 40,
      yields: 4,
      star: 3,
      isVegie: true,
      isHealthy: false,
      countrie: 'Italie',
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
    }
  ]);

  // tslint:disable-next-line: variable-name
  private _dessertRecipes = new BehaviorSubject<Recipe[]>([
    {
      id: 'd1',
      title: 'Fondant au chocolat',
      imageUrl: 'atelierdeschefs.com/media/recette-e6493-fondant-au-chocolat-creme-anglaise-au-pamplemousse.jpg',
      prepTime: 10,
      cookingTime: 7,
      yields: 6,
      star: 5,
      isVegie: true,
      isHealthy: false,
      countrie: 'France',
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
    }
  ]);

  // tslint:disable-next-line: variable-name
  private _appetizerRecipes = new BehaviorSubject<Recipe[]>([
    {
      id: 'a1',
      title: 'Verrine de kiwi et saumon fumé',
      imageUrl: 'https://static.750g.com/images/622-auto/ad7f44421b88e75913a53daaece36384/verrine-de-kiwi-et-saumon-fume.png',
      prepTime: 15,
      cookingTime: 0,
      yields: 8,
      star: 3,
      isVegie: false,
      isHealthy: false,
      countrie: 'France',
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
    }
  ]);


  getRecipes(type: string) {
    if (type === 'main') {
      return this._mainRecipes.asObservable();
    } else if (type === 'appetizer') {
      return this._appetizerRecipes.asObservable();
    } else if (type === 'dessert') {
      return this._dessertRecipes.asObservable();
    }
  }


}