export interface RecipeData {
        title: string;
        type: string;
        imageUrl: string;
        prepTime: number;
        cookingTime: number;
        totalTime: number;
        yields: number;
        star: boolean[];
        isVegie: boolean;
        isHealthy: boolean;
        country: string;
        ingredients: string[];
        direction: string[];
        userId: string;
}
