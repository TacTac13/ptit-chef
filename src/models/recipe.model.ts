export class Recipe {
    constructor(
        public id: string,
        public title: string,
        public type: string,
        public imageUrl: string,
        public prepTime: number,
        public cookingTime: number,
        public totalTime: number,
        public yields: number,
        public star: boolean[],
        public isVegie: boolean,
        public isHealthy: boolean,
        public country: string,
        public ingredients: string[],
        public direction: string[],
        public userId: string,
    ) { }
}
