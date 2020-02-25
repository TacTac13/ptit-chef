import { Component } from '@angular/core';

import { faSearch, faHamburger, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  faSearch = faSearch;
  faHamburger = faHamburger;
  faPlus = faPlus;

  constructor() {}

}
