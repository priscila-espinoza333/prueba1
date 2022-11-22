import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertController, LoadingController, ToastController} from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  modeloUsuario: string = '';
  url: string = 'https://fer-sepulveda.cl/API_PRUEBA2/api-service.php?nombreFuncion=UsuarioObtenerNombre&correo=';
  texto: string = '';
  
  apoyo = [];
  modeloContrasena = '';
  modeloContrasenaNueva = '';
  constructor(private router: Router, 
              private http: HttpClient,  
              private modal: ModalController, 
              private loadingController: LoadingController,
              private toastController: ToastController,
              private api: DbService) { }

  ngOnInit() {
    this.modeloUsuario = this.router.getCurrentNavigation().extras.state.modeloUsuario;
    console.log(this.modeloUsuario);
    this.getUsuario();
  }

  async presentToast(mensaje){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }

  correo= this.router.getCurrentNavigation().extras.state.modeloUsuario;

  getMostrarUsuario(){
    let that = this;
    return new Promise (resolve =>{
      resolve(that.http.get(this.url + this.modeloUsuario).toPromise())
    });
  }

  async getUsuario (){
    let data = await this.getMostrarUsuario();
    console.log(data);
    this.apoyo = data['result'];
  }
  cancel() {
    this.modal.dismiss(null, 'modal.dismiss');
  }
  
  confirmarCambios(){
    let that = this;
    this.loadingController.create({
      message: 'Cambiando Contraseña....',
      spinner: 'lines'
    }).then(async data => {
      data.present();

      try{
        let respuesta = await this.api.changePass(this.correo, this.modeloContrasenaNueva, this.modeloContrasena );
        console.log('respuesta: ',respuesta);
        if(respuesta ['result'][0].RESPUESTA == 'OK'){
          that.cancel();
          that.presentToast('La contraseña ha sido cambiada con exito!! ');
          that.removeData();
        }else{
          that.presentToast('La contraseña no pudo ser cambiada');
          that.removeData();
        }
      }catch(error){
        let respuesta = await this.api.changePass(this.correo, this.modeloContrasenaNueva, this.modeloContrasena );
        if(respuesta['result'] =='ERR02'){
          that.removeData();
        }
      }
      data.dismiss();
    });
  }
  removeData(){
    this.modeloContrasena = '';
    this.modeloContrasenaNueva = '';
  }
  async scanQR() {
    let that = this;
    this.texto = '';
    document.querySelector('body').classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });

    BarcodeScanner.hideBackground();


    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      setTimeout(function () {
        console.log(result.content);
        that.texto = result.content;
        document.querySelector('body').classList.remove('scanner-active');
      }, 3000);

    }

  }
}


