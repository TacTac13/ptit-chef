import { Component, OnInit } from '@angular/core';

import { faCheck, faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss'],
})
export class NewUserModalComponent implements OnInit {

  faTimes = faTimes;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.loadingCtrl.create(
      {
        keyboardClose: true,
        message: 'Création du nouvel utilisateur...'
      }
    ).then(loadingEl => {
      loadingEl.present();
      this.authService.sinup(email, password).subscribe(resData => {
        console.log(resData);
        this.modalCtrl.dismiss();
        loadingEl.dismiss();
        form.reset();
        this.presentToast('Votre compte a bien été ajouté.');
      }, errRes => {
        loadingEl.dismiss();
        const code = errRes.error.error.message;
        let message = 'Impossible de créer le nouvel utilisateur...';
        if (code === 'EMAIL_EXISTS') {
          message = 'Cette adresse email existe déjà';
        }
        this.showAlert(message);
      });
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
