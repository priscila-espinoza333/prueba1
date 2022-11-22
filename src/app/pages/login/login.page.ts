import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  modeloUsuario = '';
  modeloContrasena = '';

  constructor( private router: Router,
               private loadingController: LoadingController,
               private toastController: ToastController,
               private api: DbService) {

    console.log('Pagina login iniciada');
    
  }

  ngOnInit() {

  }
  async presentToast(mensaje){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }

  validarCredenciales(){
    let extras: NavigationExtras = {
      state:{
        modeloUsuario: this.modeloUsuario
      }
    }
    let that = this;
    this.loadingController.create({
      message: 'Logeando....',
      spinner: 'lines'
    }).then(async data => {
      data.present();

      try{
        let respuesta = await this.api.validarUsuario(this.modeloUsuario, this.modeloContrasena);
        console.log(respuesta);
        if(respuesta['result'] == 'LOGIN OK'){
        // se usa para el logueo permanente  localStorage.setItem('ingresado', 'true')
          this.router.navigate(['principal'],extras)
          that.removeData();
        }else{
          that.presentToast('Usuario no se pudo logear');
          
        }
      }catch(error){

        let respuesta = await this.api.validarUsuario(this.modeloUsuario, this.modeloContrasena);
        if(respuesta['result'] =='LOGIN NOK'){
          that.presentToast('Error Login');
          that.removeData();
        }
      }
      data.dismiss();
    });
  }
        
  cambiaPagina(){
    this.router.navigate(['/contrasena']);
  }
  removeData(){
    this.modeloUsuario = '';
    this.modeloContrasena = '';
  }
}

