import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from 'src/models/favorites.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  // tslint:disable-next-line: variable-name
  private _favorites = new BehaviorSubject<Favorite[]>([
    {
      id: 'f1',
      title: 'Mes recettes d\'asie',
      userId: 'abc',
      favoritesList: []
    },
    {
      id: 'f2',
      title: 'Itlaia en force',
      userId: 'abc',
      favoritesList: []
    },
    {
      id: 'f3',
      title: 'DME',
      userId: 'abc',
      favoritesList: []
    }
  ]);

  getFavorites(): Observable<Favorite[]> {
    return this._favorites.asObservable();
  }
}
