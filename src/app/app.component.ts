import { Component, OnInit, OnDestroy } from '@angular/core';

import { faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from 'src/service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  faHeart = faHeart;
  faSignOutAlt = faSignOutAlt;
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private menu: MenuController,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.navCtrl.navigateBack('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }


    initializeApp() {
      this.platform.ready().then(() => {
        if (Capacitor.isPluginAvailable('SplashScreen')) {
          Plugins.SplashScreen.hide();
        }
      });
    }

    onLogout() {
      this.authService.logOut();
      this.menu.close();
    }

    onFavoriesClick() {
      this.navCtrl.navigateForward('/home/favorites');
      this.menu.close();
    }

    onRecipesClick() {
      this.navCtrl.navigateForward('/home');
      this.menu.close();
    }

    ngOnDestroy() {
      if (this.authSub) {
        this.authSub.unsubscribe();
      }
    }
  }
