import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
})
export class ContrasenaPage implements OnInit {
  modeloUsuario: string = '';
  modeloContrasena: string = '';
  modeloNombre: string = '';
  modeloApellido: string = '';


  constructor(private router: Router,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private api: DbService) { }
 
              
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

   postUser(){
    let that = this;
    this.loadingController.create({
      message: 'Registrando Usuario....',
      spinner: 'lines'
    }).then(async data => {
      data.present();
      try{
        let respuesta = await this.api.crearUsuario(this.modeloUsuario, this.modeloContrasena, this.modeloNombre, this.modeloApellido);
        if(respuesta['result'][0].RESPUESTA == 'OK'){
          that.presentToast('Usuario registrado correctamente');
          this.router.navigate(['login'])
          that.removeData();
        }else{
          that.presentToast('Usuario no se puedo registrar');
        }
      }catch(error){
        let respuesta = await this.api.crearUsuario(this.modeloUsuario, this.modeloContrasena, this.modeloNombre, this.modeloApellido);
        if(respuesta['result'][0].RESPUESTA =='ERR01'){
          that.presentToast('Usuario registno registrado');
          that.removeData();
        }
      }
      data.dismiss();
    });
  }
        

  changePass(){
  }

  removeData(){
    this.modeloUsuario = '';
    this.modeloContrasena = '';
    this.modeloNombre = '';
    this.modeloApellido ='';
  }
}

