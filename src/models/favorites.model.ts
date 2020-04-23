import { FavoriteEL } from './favoritesEl.model';

export class Favorite {
    constructor(
        public id: string,
        public title: string,
        public userId: string,
        public favoritesList?: FavoriteEL[]
    ) { }
}
