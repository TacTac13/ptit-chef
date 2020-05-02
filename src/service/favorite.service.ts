import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from '../models/favorites.model';
import { FavoriteEL } from '../models/favoritesEl.model';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { FavoriteData } from '../models/favorites-data.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  private _favorites = new BehaviorSubject<Favorite[]>([]);

  getFavorites(): Observable<Favorite[]> {
    return this._favorites.asObservable();
  }

  fetchFavorites() {
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap((userId: string) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        return this.http.get<{ [key: string]: FavoriteData }>(
          `https://ptit-chef.firebaseio.com/favorites.json?orderBy="userId"&equalTo="${userId}"&auth=${fetchedToken}`
        );
      }),
      take(1),
      map(resData => {
        const favoriteDataList = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            favoriteDataList.push(new Favorite(
              key,
              resData[key].title,
              resData[key].userId,
              resData[key].pos,
              resData[key].favoritesList,
            ));
          }
        }
        return favoriteDataList;
      }),
      tap(favorite => {
        this._favorites.next(favorite);
      }));
  }

  addFavorites(
    title: string,
    pos: number,
    favoritesList: FavoriteEL[]
  ) {

    let fetechedToken: string;
    let newFavorites: Favorite;
    let generatedId: string;
    const favoriteId: string = '_' + Math.random().toString(36).substr(2, 9);

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
        newFavorites = new Favorite(
          favoriteId,
          title,
          userId,
          pos,
          favoritesList
        );
        return this.http.post<{ name: string }>(`https://ptit-chef.firebaseio.com/favorites.json?auth=${fetechedToken}`, { ...newFavorites, id: null });
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.getFavorites();
      }),
      take(1),
      tap(favorite => {
        newFavorites.id = generatedId;
        this._favorites.next(favorite.concat(newFavorites));
      })
    );
  }

  deleteFavorit(id: string) {
    let deleteFavoritList: Favorite[];
    let fetechedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetechedToken = token;
        return this.getFavorites();
      }),
      take(1),
      switchMap(favorites => {
        const deleteFavoritIndex = favorites.findIndex(rp => rp.id === id);
        deleteFavoritList = [...favorites];
        deleteFavoritList.splice(deleteFavoritIndex, 1);
        return this.http.delete(`https://ptit-chef.firebaseio.com/favorites/${id}.json?auth=${fetechedToken}`);
      }),
      tap(() => {
        for (let i = 0; i < deleteFavoritList.length; i++) {
          deleteFavoritList[i].pos = i;
        }
        deleteFavoritList.map(favorite => {
          this.editFavorites(
            favorite.id,
            favorite.title,
            favorite.userId,
            favorite.pos,
            favorite.favoritesList,
            true
          ).subscribe();
        });
        this._favorites.next(deleteFavoritList);
      }));
  }

  editFavorites(
    id: string,
    title: string,
    userId: string,
    pos: number,
    favoritesList: FavoriteEL[],
    isDeleted: boolean
  ) {
    let fetchedToken: string;
    let updatedFavoriteList: Favorite[];
    const updatedFavorite: Favorite = new Favorite(
      id,
      title,
      userId,
      pos,
      favoritesList
    );

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.getFavorites();
      }),
      take(1),
      switchMap(favorites => {
        const updatedfavoriteIndex = favorites.findIndex(rp => rp.id === id);
        updatedFavoriteList = [...favorites];
        updatedFavoriteList[updatedfavoriteIndex] = updatedFavorite;
        return this.http.put(`https://ptit-chef.firebaseio.com/favorites/${id}.json?auth=${fetchedToken}`, { ...updatedFavoriteList[updatedfavoriteIndex], id: null });
      }),
      tap(() => {
        if (!isDeleted) {
          this._favorites.next(updatedFavoriteList);
        }
      })
    );
  }
}
