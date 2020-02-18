export class Recipe {
    constructor(
        public id: string,
        public title: string,
        public imageUrl: string,
        public prepTime: number,
        public cookingTim: number,
        public yields: number,
        public star: number,
        public isVegie: boolean,
        public countrie: string,
        public ingredients: string[],
        public direction: string[],
    ) { }
}
