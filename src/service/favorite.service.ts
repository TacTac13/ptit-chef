import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from 'src/models/favorites.model';
import { FavoriteEL } from 'src/models/favoritesEl.model';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { FavoriteData } from 'src/models/favorites-data.model';

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
        console.log(userId);

        newFavorites = new Favorite(
          favoriteId,
          title,
          userId,
          favoritesList
        );
        return this.http.post<{ name: string }>(`https://ptit-chef.firebaseio.com/favorites.json?auth=${fetechedToken}`, { ...newFavorites, id: null });
      }),
      switchMap(resData => {
        console.log(resData);
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
}
