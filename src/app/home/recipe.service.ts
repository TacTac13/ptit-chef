import { Injectable } from '@angular/core';
import { Recipe } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Dhal au curry',
      imageUrl: 'https://static.750g.com/images/auto-427/06e0a3d7987f55ada249cc87cc759488/dhal.jpg',
      prepTime: 20,
      cookingTim: 20,
      yields: 4,
      star: 4,
      isVegie: true,
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
      id: 'r2',
      title: 'Macaronni au fromage',
      imageUrl: 'https://static.cuisineaz.com/400x320/i9734-les-macaroni-au-fromage-de-modern-family.jpg',
      prepTime: 30,
      cookingTim: 40,
      yields: 4,
      star: 3,
      isVegie: true,
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
  ];


}
