import { Component, OnInit, ViewChild } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FavoriteService } from 'src/service/favorite.service';
import { Favorite } from 'src/models/favorites.model';
import { IonReorderGroup } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  favoritesList: Favorite[] = [];
  faBars = faBars;

  constructor(
    private favaoriteService: FavoriteService
  ) { }

  ngOnInit() {
    this.favaoriteService.getFavorites().subscribe(favorites => {
      this.favoritesList = favorites;
    });
  }

  doReorder(event: any) {
    this.favoritesList = event.detail.complete(this.favoritesList);
  }

}
