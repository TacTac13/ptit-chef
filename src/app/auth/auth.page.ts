import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { NewUserModalComponent } from '../home/modal/new-user-modal/new-user-modal.component';
import { NgForm } from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  scrWidth: number;

  @HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {
    this.getScreenSize();
  }

  ngOnInit() {
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Echec de connexion',
      message,
      buttons: ['OK']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onLogin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Chargement...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password).subscribe(resData => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/home/tabs/recipes');
          form.reset();
        },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Veuillez rentrer une adresse mail et un mot de passe valide';
            if (code === 'EMAIL_EXISTS') {
              message = 'Cette adresse email existe déjà';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Cette adresse email n\'existe pas';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Ce mot de pas est incorrect';
            }
            this.showAlert(message);
          });
      });
  }

  openNewUserModal() {
    this.modalCtrl.create({ component: NewUserModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }

}
