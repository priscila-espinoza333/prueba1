import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SQLite } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  url: string = 'https://fer-sepulveda.cl/API_PRUEBA2/api-service.php';

  constructor(private router: Router, private http: HttpClient, private sqlite: SQLite) { }

  canActivate(){

  } 
  autenticator(){

  }
  crearUsuario(correo, contrasena, nombre, apellido){
    let that = this;
    return new Promise (resolve => {
      resolve(that.http.post(that.url,{
        nombreFuncion: 'UsuarioAlmacenar',
        parametros:[correo, contrasena, nombre, apellido]
      }).toPromise())
    })
  }
  validarUsuario(correo, contrasena){
    let that = this;
    return new Promise (resolve => {
      resolve(that.http.post(that.url,{
        nombreFuncion: 'UsuarioLogin',
        parametros:[correo, contrasena]
      }).toPromise())
    })
  }
  changePass(correo, contrasenaNueva, contrasenaActual){
    let that = this;
    return new Promise(resolve =>{
      resolve(that.http.patch(that.url,{
        nombreFuncion: 'UsuarioModificarContrasena',
        parametros: [correo, contrasenaNueva, contrasenaActual]
      }).toPromise())
    })
 
  }
  asistenciaAlmacenar(correo, idClase){
    let that = this;
    return new Promise (resolve => {
      resolve(that.http.post(that.url,{
        nombreFuncion: 'AsistenciaAlmacenar',
        parametros:[correo, idClase]
      }).toPromise())
    })
  }
}
