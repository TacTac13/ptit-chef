export class FavoriteEL {
    constructor(
        public id: string,
        public title: string,
        public imageUrl: string,
        public stars: boolean[],
        public userId: string
    ) { }
}
