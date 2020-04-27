import { FavoriteEL } from './favoritesEl.model';

export interface FavoriteData {
    title: string;
    userId: string;
    pos: number;
    favoritesList?: FavoriteEL[];
}
